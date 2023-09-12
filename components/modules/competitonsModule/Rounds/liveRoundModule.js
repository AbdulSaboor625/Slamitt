import {
  Avatar,
  Button,
  Divider,
  Image,
  Input,
  Slider,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearJudgeState,
  getAllContainers,
  judgeLogoutSocket,
  logoutJudge,
  notify,
  updateJudge,
  updateRound,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import {
  getCrewPermissions,
  getPresenceChannelName,
  weightedScoreCalculator,
} from "../../../../utility/common";
import { socketEvents } from "../../../../utility/config";
import { singleMockRoundScoreSheet } from "../../../../utility/excelService";
import {
  DeleteIcon,
  DotsIcon,
  ExportSubmissionIcon,
} from "../../../../utility/iconsLibrary";
import AppDropDown from "../../../AppDropdown";
import ConfirmDeleteModal from "../confirmDeleteModal";
import MockRoundModule from "./MockRoundModule";
import AddJudgeModule from "./addJudgeModule";
import AssesementCriteriaModule from "./assesementCriteriaModule";
import Scores from "./scores/scores";
import Submissions from "./submissions";
import Tasks from "./tasks";

const LiveRound = ({
  readOnlyState,
  handleJudgeThisRound,
  setRoundLiveOrDraft,
  data,
  containers,
  pusher,
  deleteRound,
  rooms,
  setContainers,
}) => {
  const criteria = data.assessmentCriteria;
  const [pusherChannel, setPusherChannel] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const { role, email } = useSelector((state) => state.auth.user);
  const crewPermissions = getCrewPermissions(data?.Competition?.crew, email);
  const [roundWeightage, setRoundWeightage] = useState(
    data.roundWeightage || 100
  );
  const [judgesList, setJudgesList] = useState([]);
  const [weightageEdit, setWeightageEdit] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    pointsCalculator();
  }, []);

  useEffect(() => {
    getAllJudges();
  }, []);

  useEffect(() => {
    if (data) {
      if (data.type === "GENERAL" || !data.type) {
        getAllJudges();
        setRoundWeightage(data.roundWeightage);
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && containers) {
      pointsCalculator();
    }
  }, [containers, data]);

  const dotsMenu = [{ label: "Delete Round", value: "delete" }];

  const pointsCalculator = () => {
    let total = 0;

    if (!data?.type || data?.type === "GENERAL") {
      criteria?.forEach((criterion) => {
        if (criterion?.points > 1000) {
          criterion.points = 1000;
        }
        total += parseInt(criterion?.points || 0);
      });
    } else if (data && data?.type === "MOCK") {
      if (containers && containers?.length) {
        if (data?.maxPoints > 1000) {
          data.maxPoints = 1000;
        }
        total = parseInt(data?.maxPoints || 0);
      }
    }

    setTotalPoints(total);
  };

  const _addJudge = async (judge) => {
    judge.competitionRoundCode = data.competitionRoundCode;
    try {
      const response = await Api.post(`/judge/invite-judge`, judge);
      if (response.code && response.result) {
        getAllJudges();
        dispatch(
          notify({
            type: "success",
            message: response.message,
          })
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const getAllJudges = async () => {
    try {
      const response = await Api.get(
        `judge/getJudges/${data.competitionRoundCode}`
      );
      if (response.code && response.result) {
        setJudgesList(response.result);
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };
  const _getAllJudges = () => {
    getAllJudges();
  };
  useEffect(() => {
    if (data && data.competitionCode && data.assignedRoomCode) {
      const competitionRoomCode = `${data.competitionCode}-${data.assignedRoomCode}`;
      const channel = pusher.subscribe(
        getPresenceChannelName(competitionRoomCode)
      );
      console.log("channel", channel);
      if (channel) setPusherChannel(channel);
      channel.bind("receive_message", (payload) => {
        console.log("payload", payload);
        if (payload.event === socketEvents.judge_status_update) {
          getAllJudges();
        } else if (payload.event === socketEvents.update_submissions) {
          dispatch(getAllContainers());
        }
      });

      channel.bind("pusher:member_removed", (member) => {
        dispatch(
          judgeLogoutSocket({
            socketId: member.id,
          })
        );
        dispatch(logoutJudge());
        dispatch(clearJudgeState());
      });
    }
  }, [data && data.competitionCode && data.assignedRoomCode]);

  const removejudge = async (judge) => {
    try {
      const response = await Api.get(`/judge/remove-judge/${judge.judgeCode}`);
      if (response.code) {
        getAllJudges();
        dispatch(
          notify({
            type: "success",
            message: response.message,
          })
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const _updateRound = async (payload) => {
    dispatch(
      updateRound({
        allowJudgeEntry: payload.allowJudgeEntry,
        competitionRoundCode: data.competitionRoundCode,
      })
    );
  };

  const allowJudgeReEntry = async (judgeCode) => {
    dispatch(
      updateJudge({
        judgeCode,
        status: "LOGGED OUT",
      })
    );
  };

  const _resendInvite = async (email) => {
    const payload = {
      email,
      competitionRoundCode: data.competitionRoundCode,
    };
    try {
      const response = await Api.post(`/judge/resend-invitation`, payload);
      if (response.code) {
        dispatch(
          notify({
            type: "success",
            message: response.message,
          })
        );
        getAllJudges();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const titleCase = (str) => {
    return str?.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
  };

  const updateWeightage = (weightage) => {
    if (weightage < 0) {
      dispatch(
        notify({ type: "eroor", message: "Weightage must be more than 0" })
      );
    } else if (weightage > 200) {
      dispatch(
        notify({ type: "eroor", message: "Weightage must be less than 200" })
      );
    } else if (weightage !== roundWeightage) {
      const payload = {
        roundWeightage: weightage,
        competitionRoundCode: data.competitionRoundCode,
      };
      dispatch(updateRound(payload));
      setRoundWeightage(weightage);
    }
    setWeightageEdit(false);
  };

  const _deleteRound = (round) => {
    setVisible(false);
    deleteRound(round);
  };

  const DeleteRoundButton = () => {
    return (
      <Tooltip
        title={"Delete Round"}
        trigger={"hover"}
        placement="top"
        color={"blue"}
      >
        <Button
          className="buttonDelete"
          type="ghost"
          icon={<DeleteIcon />}
          onClick={() => setVisible(true)}
        />
      </Tooltip>
    );
  };

  const isWeitageValid = (value) => {
    let flag = true;
    containers.forEach((container) => {
      const rnd = container.roundData.find(
        ({ roundCode }) => data.roundCode === roundCode
      );
      const weightageScore = Number(
        weightedScoreCalculator(rnd?.roundScore, Number(value))
      );
      const weightagetotal = (data?.totalPoints * Number(value)) / 100;
      const adjusted = rnd?.adjustedScore
        ? Number((rnd?.adjustedScore * value) / 100)
        : 0;
      if (adjusted) {
        const total = weightageScore + adjusted;
        if (total > weightagetotal) {
          flag = false;
          return false;
        }
        console.log("formats1", total);
        console.log("formats2", weightageScore);
        console.log("formats3", adjusted);
      }
    });
    return {
      flag,
      message: flag
        ? ""
        : `Some of the adjusted score values do not allow change the weightage to ${value}%`,
    };
  };

  console.log("formats", isWeitageValid(80));

  // const [room, setRoom] = useState({});
  // useEffect(() => {
  //   setRoom(
  //     rooms?.all?.find((room) => room?.roomCode === data.assignedRoomCode)
  //   );
  // }, []);

  return (
    <div className="roundContentBlock">
      <div className="roundContentHeader">
        <div className="roundContentInfo">
          <Avatar
            src={
              data.imageURL && !data.imageURL.includes("https://avataaars.io/")
                ? data.imageURL
                : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
            }
          />
          <div className="roundContentText">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Typography.Title className="roundContentTitle">
                  {titleCase(data.roundName)}
                </Typography.Title>
                {/* <Typography.Text className="roundContentLive">
              Live{" "} */}

                {!readOnlyState ? (
                  data?.type === "GENERAL" ? (
                    judgesList?.length ? (
                      <Tooltip
                        title={"Delete all Judges to enable draft mode"}
                        trigger={"hover"}
                        placement="bottom"
                        color={"black"}
                      >
                        <Switch
                          disabled={judgesList && judgesList.length}
                          defaultChecked={true}
                          onChange={(e) => setRoundLiveOrDraft(e)}
                        />
                      </Tooltip>
                    ) : (
                      <Switch
                        disabled={judgesList && judgesList.length}
                        defaultChecked={true}
                        onChange={(e) => setRoundLiveOrDraft(e)}
                      />
                    )
                  ) : data.type === "MOCK" ? (
                    <Switch
                      defaultChecked={true}
                      onChange={(e) => {
                        setRoundLiveOrDraft(e);
                      }}
                    />
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}

                {/* </Typography.Text> */}
              </div>
            </div>
            <div className="liveRoundActiveText">
              <Typography.Text>
                {/* Assigned to List :{" "} */}
                <strong>
                  {`${titleCase(
                    data?.type === "MOCK" ? "Direct Entry" : "Judge Rating"
                  )} `}
                </strong>
                {/* |{" "} */}
                <span className="seperator"></span>
                <strong>{`${titleCase(
                  rooms?.all?.find(
                    (room) => room?.roomCode === data.assignedRoomCode
                  )?.roomName
                )} List (${
                  rooms?.all?.find(
                    (room) => room?.roomCode === data.assignedRoomCode
                  )?.containersCount
                })`}</strong>{" "}
              </Typography.Text>
            </div>
          </div>

          <AppDropDown
            className="largeScreen:hidden roundMobileOptions"
            label={<DotsIcon />}
            menu={dotsMenu}
            onClick={(e) => {
              const select = dotsMenu[Number(e.key)];
              if (select.value === "delete") {
                setVisible(true);
              } else if (select.value === "reset") {
                onResetRound();
              }
            }}
          />
        </div>

        {/* <Button
          type="ghost"
          style={{
            fontSize: "1rem",
            borderRadius: "0.5rem",
            backgroundColor: "black",
            color: "white",
            fontWeight: "400",
          }}
          onClick={() =>
            singleRoundScoreSheet(
              data.roundCode,
              containers,
              `${data?.Competition?.competitionName}_${data.roundName}`,
              data.roundWeightage
            )
          }
        >
          Export Scoresheet
        </Button> */}
        {/* {data.type === "GENERAL" || !data.type ? ( */}
        <div className="roundContentStats">
          <div className="roundContentStatsBox">
            <Typography.Title className="roundContentStatsNumber">
              {totalPoints}
            </Typography.Title>
            <Typography.Text className="roundContentStatsTitle">
              {data?.type === "MOCK" ? "Max" : "Total"} Points
            </Typography.Text>
          </div>
          {readOnlyState ? (
            <div className="roundContentStatsBox">
              <Typography.Title className="roundContentStatsNumber">
                {roundWeightage}%
              </Typography.Title>
              <Typography.Text className="roundContentStatsTitle">
                <span>Round</span> Weightage
              </Typography.Text>
            </div>
          ) : (
            <div className="roundContentStatsBox slide-hide">
              <h3
                // className="roundContentStatsNumber"
                style={{ cursor: "ew-resize", userSelect: "none" }}
              >
                {!weightageEdit ? (
                  <Typography.Text
                    onClick={() =>
                      role === "CREW" && !crewPermissions?.manageScoring
                        ? null
                        : setWeightageEdit(true)
                    }
                  >
                    {roundWeightage}%
                  </Typography.Text>
                ) : (
                  <Input
                    autoFocus
                    bordered={false}
                    className="text-center"
                    type="number"
                    defaultValue={roundWeightage}
                    placeholder={roundWeightage}
                    onBlur={(e) => {
                      const valid = isWeitageValid(e.target.value);
                      valid?.flag
                        ? updateWeightage(parseFloat(e.target.value).toFixed(2))
                        : dispatch(
                            notify({
                              message: valid.message,
                              type: "error",
                            })
                          ) && updateWeightage(roundWeightage);
                    }}
                    onPressEnter={(e) => {
                      const valid = isWeitageValid(e.target.value);
                      valid?.flag
                        ? updateWeightage(parseFloat(e.target.value).toFixed(2))
                        : dispatch(
                            notify({
                              message: valid.message,
                              type: "error",
                            })
                          ) && updateWeightage(roundWeightage);
                    }}
                  />
                )}

                <Slider
                  tooltipVisible={false}
                  value={roundWeightage}
                  disabled={role === "CREW" && !crewPermissions?.manageScoring}
                  max={200}
                  min={0}
                  onChange={(e) => {
                    setRoundWeightage(e);
                  }}
                  onAfterChange={(e) => {
                    dispatch(
                      updateRound({
                        roundWeightage: typeof e === "object" ? e[0] : e,
                        competitionRoundCode: data.competitionRoundCode,
                      })
                    );
                  }}
                />
              </h3>
              <Typography.Text className="roundContentStatsTitle">
                <span>Round</span> Weightage
              </Typography.Text>
            </div>
          )}
        </div>
        {/* ) : (
          <></>
        )} */}
      </div>
      {readOnlyState &&
        (!judgesList || !judgesList.length) &&
        data?.type !== "MOCK" && (
          <div className="roundJudgedStatus">This round was not judged</div>
        )}

      <div className="participantTabsContent">
        {data.type === "GENERAL" || !data.type ? (
          <div className="relative">
            <Tabs className="roundSubtabset" defaultActiveKey="1">
              <Tabs.TabPane tab="Criteria" key="1">
                <Typography.Text className="w-[80%] draftTextInfo">
                  Judge rating rounds allow you to invite judges so they may
                  score your participants for pre-defined judgement criterias.
                </Typography.Text>
                <AssesementCriteriaModule
                  editMode={false}
                  criterias={criteria}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Judges" key="2">
                <AddJudgeModule
                  readOnlyState={readOnlyState}
                  handleJudgeThisRound={() =>
                    handleJudgeThisRound(data.competitionRoundCode)
                  }
                  judgesList={judgesList}
                  addJudge={_addJudge}
                  competitionRoundCode={data.competitionRoundCode}
                  removejudge={removejudge}
                  round={data}
                  updateRoundSettings={_updateRound}
                  containers={containers}
                  resendInvite={_resendInvite}
                  allowJudgeReEntry={allowJudgeReEntry}
                  _getAllJudges={_getAllJudges}
                  pusherChannel={pusherChannel}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Tasks" key="4">
                <Tasks round={data} competition={data?.Competition} />
              </Tabs.TabPane>
              {
                // (data?.submissionsSettings?.guidelines?.length ||
                //   data?.submissionsSettings?.guidelinesExtended
                //     ?.preConfiguredGuidelines) &&
                //   data?.submissionsSettings?.visibilty?.guidelines &&
                data?.submissionsSettings?.isLive && (
                  <Tabs.TabPane tab="Submissions" key="3">
                    <Submissions
                      readOnlyState={readOnlyState}
                      allcontainers={containers}
                      roundData={data}
                      rooms={rooms?.all}
                      competition={data?.Competition}
                      organiserSide={true}
                    />
                  </Tabs.TabPane>
                )
              }
              <Tabs.TabPane tab="Scores" key="5">
                <Scores
                  judgesList={judgesList}
                  containers={containers}
                  setContainers={setContainers}
                  round={data}
                  competition={data?.Competition}
                />
              </Tabs.TabPane>
            </Tabs>
            {!readOnlyState && (
              <div className="roundContentNewHeader absolute top-0 right-0">
                {role === "CREW" ? (
                  crewPermissions?.manageScoring ? (
                    <DeleteRoundButton />
                  ) : null
                ) : (
                  <DeleteRoundButton />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="submissionTableBlock importScores">
            <div className="flex items-center justify-between">
              {!readOnlyState && (
                <div className="roundContentNewHeader absolute top-0 right-0">
                  {role === "CREW" ? (
                    crewPermissions?.manageScoring ? (
                      <DeleteRoundButton />
                    ) : null
                  ) : (
                    <DeleteRoundButton />
                  )}
                </div>
              )}
            </div>
            <Tabs className="roundSubtabset" defaultActiveKey="1">
              <Tabs.TabPane tab="Scores" key="1">
                <Typography.Text className="w-[80%] draftTextInfo">
                  Direct entry allow you to set up final max points without
                  adding any criteria. Take the round live to add points and
                  update overall contestant scores.
                </Typography.Text>
                <Divider className="roundActiveDivider" />

                {!data.isLive ? (
                  <div className="roundActiveScoresHead">
                    <Typography.Text className="textEdit">
                      Tap on max points to edit it
                    </Typography.Text>
                  </div>
                ) : (
                  <div className="roundActiveScoresHead">
                    <Button
                      className="buttonImportSubmission"
                      onClick={async () => {
                        await singleMockRoundScoreSheet(
                          data.roundCode,
                          data?.Competition?.competitionName +
                            "_" +
                            data?.roundName,
                          data
                        );
                      }}
                    >
                      <ExportSubmissionIcon />
                      {/* Export Mock Round Scores */}
                      Export Round Scores
                    </Button>
                  </div>
                )}

                {containers && containers.length > 0 ? (
                  <MockRoundModule
                    roundCode={data.roundCode}
                    data={data}
                    containers={containers}
                    isLive={data.isLive}
                  />
                ) : (
                  <div className="text-center">
                    <Image
                      preview={false}
                      src={
                        "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1669311791301_image_402.png"
                      }
                      alt="mockRoundEmpty"
                    />
                    <Typography.Title level={5}>
                      {` Add ${
                        data?.Competition?.competitionType === "TEAM"
                          ? "team"
                          : "participant"
                      } codes to assign points`}
                    </Typography.Title>
                  </div>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Tasks" key="4">
                <Tasks round={data} competition={data?.Competition} />
              </Tabs.TabPane>
              {data?.submissionsSettings?.isLive && (
                <Tabs.TabPane tab="Submissions" key="2">
                  <Submissions
                    readOnlyState={readOnlyState}
                    allcontainers={containers}
                    roundData={data}
                    rooms={rooms?.all}
                    competition={data?.Competition}
                    organiserSide={true}
                  />
                </Tabs.TabPane>
              )}
            </Tabs>
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        isModalVisible={isVisible}
        hideModal={() => setVisible(false)}
        onConfirm={() => _deleteRound(data)}
        description="All the scores and related data will be deleted immediately."
      />
    </div>
  );
};

export default LiveRound;
