import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Avatar, Button, Image, Skeleton, Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPersistConfig,
  getAllCompetitionsOrganized,
  getAllCompetitionsParticipated,
  getAllRounds,
  getCategoryAndSubCategory,
  getChat,
  getChatToken,
  getCompetitionParticipatedByCompetitionCode,
  getParticipantContainer,
  notify,
  persitCompetition,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import {
  calculatePoint,
  getPresenceChannelName,
  isValidRegistration,
} from "../../../../utility/common";
import { socketEvents } from "../../../../utility/config";
import { ArrowLinkIcon } from "../../../../utility/iconsLibrary";
import { leaderboardEmptyState } from "../../../../utility/imageConfig";
import AppModal from "../../../AppModal";
import LeaderBoardContent from "../../Leaderboard/content";
import LeaderBoardHeader from "../../Leaderboard/header";
import ProgressBar from "../../competitonsModule/progressBar";
import MyTeam from "./myTeam";
import Scores from "./scores";
import Submission from "./submission";
import TasksForParticipant from "./tasksForParticipant";
import Timeline from "./timeline";

const NoAccessModal = ({ isOpen, onCancel, container }) => {
  return (
    <AppModal
      className="removedFormCompetitionModal"
      isVisible={isOpen}
      onCancel={onCancel}
    >
      <div className="flex flex-col items-center removedFormCompetitionModalContent">
        <Image
          preview={false}
          alt="Error"
          width={120}
          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1678873821432_accessError.png"
        />
        <Typography.Text className="removedFormCompetitionModalTitle">
          {container?.competition?.competitionType === "SOLO"
            ? "Your Team was removed from this competition"
            : "You were removed from this competition."}
        </Typography.Text>
        <Typography.Text className="removedFormCompetitionModalText">
          Contact the organiser for more details
        </Typography.Text>
      </div>
    </AppModal>
  );
};

const emptyStateText = (competition, container, tab = "") => {
  const tabSpesificText = () => {
    switch (tab) {
      case "timeline":
        return "to Access Real-time competition updates from the organiser";
      case "scores":
        return "to access your performance reviews and feedback from judges";
      case "submissions":
        return "to upload and track your submissions";
      case "tasks":
        return "to see tasks from organiser";
    }
  };
  if (competition?.minTeamSize && competition?.teamSize) {
    if (competition?.minTeamSize > container?.users?.length) {
      return `Add minimum no. of participants and Confirm Registration ${tabSpesificText()}`;
    } else if (competition?.teamSize === container?.users?.length) {
      return `Max team size has been met. Lock Registration ${tabSpesificText()}`;
    } else {
      return `Lock Registration ${tabSpesificText()}`;
    }
  } else if (competition?.teamSize && !competition?.minTeamSize) {
    if (competition?.teamSize > container?.users?.length) {
      return `Add participants and Lock Registration ${tabSpesificText()}`;
    } else {
      return `Max team size has been met. Lock Registration ${tabSpesificText()}`;
    }
  }
};

const ParticipantsV2 = ({ pusher }) => {
  const router = useRouter();
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [submissionSelected, setSubmissionSelected] = useState("");
  const [isNoAccessModalOpen, setIsNoAccessModalOpen] = useState(false);
  const [loadDone, setLoadDone] = useState(false);
  const [isValidRegistrationFlag, setValidRegistrationFlag] = useState(false);

  const [scoresList, setScoresList] = useState([]);

  const dispatch = useDispatch();
  const hmsActions = useHMSActions();

  const competition = useSelector((state) => state.competition);
  const container = useSelector((state) => state.containers);
  const chatState = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  useEffect(() => {
    if (!router.query.data) return;
    const [competitionCode] = router.query.data;
    if (competitionCode) {
      dispatch(
        getCompetitionParticipatedByCompetitionCode({
          competitionCode,
          callApi: true,
        })
      );
      dispatch(getParticipantContainer(competitionCode));
      dispatch(
        persitCompetition({
          competitionCode,
          organized: false,
          email: user?.email,
        })
      );
      dispatch(getCategoryAndSubCategory());
    }
  }, [router.query]);

  useEffect(() => {
    if (!router.query.data) return;
    const [competitionCode] = router.query.data;

    if (competitionCode) fetchCompetitionScores(competitionCode);
  }, [router.query, competition.round.details]);

  useEffect(() => {
    dispatch(getAllCompetitionsParticipated());
    dispatch(getAllCompetitionsOrganized());
  }, []);

  async function fetchTimelineData() {
    const response = await Api.get(
      `/timeline/${container.current?.containerCode}`
    );
    if (response?.code && response?.result)
      setTimelineEvents([...response.result]);
  }

  useEffect(() => {
    if (container && container.current) fetchTimelineData();
  }, [container]);

  useEffect(() => {
    if (
      competition &&
      competition.current &&
      competition.current.competitionCode
    ) {
      const competitionCode = competition.current.competitionCode;
      const channel = pusher.subscribe(competitionCode);

      channel.bind("receive_message", (payload) => {
        console.log("payload", payload);
        if (payload.event === socketEvents.update_competition_setting)
          dispatch(
            getCompetitionParticipatedByCompetitionCode({
              competitionCode,
              callApi: true,
            })
          );
        else if (payload.event === socketEvents.container_fetch_score) {
          fetchCompetitionScores(competitionCode);
          dispatch(
            getCompetitionParticipatedByCompetitionCode({
              competitionCode,
              callApi: true,
            })
          );
        } else if (payload.event === socketEvents.weightage_change) {
          fetchCompetitionScores(competitionCode);
        } else if (
          payload.event === socketEvents.timeline_update &&
          payload.timelineEvent
        ) {
          fetchTimelineData();
        } else if (payload.event === socketEvents.submission_settings_update) {
          dispatch(getAllRounds(competitionCode));
        }
      });

      if (container && container.current && container.current.containerCode) {
        const containerCode = container.current.containerCode;
        const channel = pusher.subscribe(containerCode);
        channel.bind("receive_message", (payload) => {
          if (payload.event === socketEvents.room_containers_update)
            dispatch(
              getCompetitionParticipatedByCompetitionCode({
                competitionCode,
                callApi: true,
              })
            );
          else if (payload.event === socketEvents.participant_invitation) {
            if (
              user &&
              payload.userCodes &&
              payload.userCodes.length &&
              payload.userCodes.find((userCode) => userCode === user.userCode)
            ) {
              setIsNoAccessModalOpen(true);
              dispatch(clearPersistConfig());
              // dispatch(
              //   notify({
              //     type: "error",
              //     message: `${
              //       payload.isAdmin ? "Team Leader" : "Organiser"
              //     } has removed you from this competition`,
              //   })
              // );
            } else {
              dispatch(
                getCompetitionParticipatedByCompetitionCode({
                  competitionCode,
                  callApi: true,
                })
              );
            }
          } else if (
            payload.event === socketEvents.timeline_update &&
            payload.timelineEvent
          ) {
            if (
              payload.timelineEvent.data.status === "DELETED" &&
              payload.timelineEvent.data.userCode === user.userCode
            ) {
              setIsNoAccessModalOpen(true);
            } else {
              fetchTimelineData();
              dispatch(
                getCompetitionParticipatedByCompetitionCode({
                  competitionCode,
                  callApi: true,
                })
              );
              dispatch(getParticipantContainer(competitionCode));
              // setTimelineEvents([ payload.timelineEvent, ...timelineEvents ]);
            }
          }
        });
        setIsNoAccessModalOpen(false);
      }
    }
    setTimeout(() => {
      setLoadDone(true);
    }, 3000);
  }, [
    competition && competition.current && competition.current.competitionCode,
    container && container.current && container.current.containerCode,
  ]);

  // TODO: Fix notification issue assignee:Vaibhab
  useEffect(() => {
    let role = "";
    if (window.location.pathname.includes("/o/")) role = "organizer";
    else if (window.location.pathname.includes("/c/")) role = "crew";
    else if (window.location.pathname.includes("/p/")) role = "participant";
    // if (chatState.container.containerCode || chatState.container.roomCode) {
    dispatch(getChatToken(role));
    dispatch(getChat(chatState.container));

    // }
  }, [chatState.container.containerCode || chatState.container.roomCode]);

  useEffect(() => {
    if (chatState.token) {
      if (isConnected) {
        hmsActions.leave().then((r) =>
          hmsActions.join({
            userName: user.userCode,
            authToken: chatState.token,
            settings: {
              isAudioMuted: true,
            },
          })
        );
      } else {
        hmsActions.join({
          userName: user.userCode,
          authToken: chatState.token,
          settings: {
            isAudioMuted: true,
          },
        });
      }
    }
  }, [chatState.token]);

  const fetchCompetitionScores = async (competitionCode) => {
    try {
      const response = await Api.get(`/container/scores/${competitionCode}`);
      if (response.code && response.result) {
        // const allScores = response?.result;
        // allScores.sort((a, b) => parseInt(b?.scores) - parseInt(a?.scores));
        setScoresList(response?.result);
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
  };

  useEffect(() => {
    if (
      container.current &&
      competition?.current &&
      competition?.current?.competitionType == "TEAM"
    ) {
      setValidRegistrationFlag(
        isValidRegistration(container.current, competition?.current) &&
          container?.current?.lockRegistration
      );
    } else if (
      container.current &&
      competition?.current &&
      competition?.current?.competitionType == "SOLO"
    ) {
      setValidRegistrationFlag(true);
    }
  }, [container?.current, competition?.current]);

  const handleContainerCRUD = async () => {
    const oldUser = container?.current?.users?.find(
      (u) => u.email === user?.email
    );
    if (oldUser && oldUser?.status === "INVITED") {
      try {
        await Api.update(
          `container/${container?.current?.containerCode}/crud-container-user`,
          {
            user: { ...oldUser, status: "ONBOARDED" },
            type: "UPDATE",
            competitionCode: container?.current?.competitionCode,
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    handleContainerCRUD();
    // dispatch(getAllRounds({ cCode: container?.competitionCode }));
  }, [container?.current]);

  // For LeaberBoard Content
  const [params, setParams] = useState();
  const [leaderboard, setLeaderboard] = useState(null);
  const [load, setLoad] = useState(true);
  const [containers, setContainers] = useState([]);
  const [isAutoUpdate, setIsAutoUpdate] = useState(false);

  useEffect(() => {
    if (leaderboard) setIsAutoUpdate(leaderboard?.autoUpdate);
  }, [leaderboard]);

  useEffect(() => {
    getLeaderBoard();
    // dispatch(getCategoryAndSubCategory());
    // dispatch(getAllCompetitionsParticipated());
    // dispatch(getAllCompetitionsOrganized());
  }, [params]);

  const getLeaderBoard = async (containerUpdate = true) => {
    if (params) {
      setLoad(true);
      try {
        const response = await Api.get(`/leaderboards/${params}`);
        if (response.code && response.result) {
          setLeaderboard(response.result);
          // const allContainers = response?.result?.scoreboard;
          // const scores = allContainers.map((c) => c.score);
          // let uniqueScores = [...new Set(scores)];
          // const containerWithRank = allContainers?.map((c) => {
          //   let currentRank = uniqueScores?.indexOf(c?.score) + 1;
          //   return { ...c, currentRank, prevRank: currentRank };
          // });
          setContainers(response?.result?.scoreboard);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(notify({ message: error.message, type: "error" }));
      }
      setLoad(false);
    }
  };
  const onUpdateLeaderBoardPressed = async (clickedUpdate = false) => {
    if (params) {
      setLoad(true);
      try {
        const response = await Api.get(`/leaderboards/${params}/update`);
        if (response.code && response.result) {
          // const allContainers = response?.result;
          // const scores = allContainers.map((c) => c.score);
          // let uniqueScores = [...scores];
          // const containerWithRank = allContainers?.map((c) => {
          //   let currentRank = uniqueScores?.indexOf(c?.score) + 1;
          //   return { ...c, currentRank, prevRank: currentRank };
          // });
          // setContainers(containerWithRank);

          setContainers(response.result);
          if (clickedUpdate)
            dispatch(
              notify({
                type: "success",
                message: "Leaderboard updated successfully.",
              })
            );
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(notify({ message: error.message, type: "error" }));
      }
      setLoad(false);
    }
  };

  useEffect(() => {
    if (container?.current?.leaderboard) {
      setParams(container?.current?.leaderboard?._id);
      if (isAutoUpdate) {
        onUpdateLeaderBoardPressed(false);
      } else {
        getLeaderBoard();
      }
    }
  }, [container]);

  useEffect(() => {
    if (container) {
      const channel = pusher.subscribe(
        getPresenceChannelName(container?.current?.leaderboard?._id)
      );

      channel.bind("receive_message", async (payload) => {
        if (payload.event === "LEADERBOARD_SCORE_UPDATE") {
          setParams(container?.current?.leaderboard?._id);
          if (isAutoUpdate) {
            onUpdateLeaderBoardPressed(false);
          } else {
            getLeaderBoard();
          }
        }
      });
    }
  }, [container]);

  useEffect(() => {
    if (competition?.current) {
      const channel = pusher.subscribe(
        getPresenceChannelName(competition?.current?.competitionCode)
      );

      channel.bind("receive_message", async (payload) => {
        if (payload.event === socketEvents.round_live) {
          if (isAutoUpdate) onUpdateLeaderBoardPressed(false);
        } else if (payload.event == "LIVE_LEADERBOARD_UPDATE") {
          getLeaderBoard(false);
        }
      });
    }
  }, [competition?.current]);

  useEffect(() => {
    const channel = pusher?.subscribe(
      getPresenceChannelName(container?.current?.competitionRoomCode)
    );
    setParams(container?.current?.leaderboard?._id);
    channel?.bind("receive_message", (payload) => {
      if (payload?.event === socketEvents?.round_score_update) {
        if (isAutoUpdate) {
          onUpdateLeaderBoardPressed(false);
        } else {
          getLeaderBoard();
        }
      }
    });
  }, [container]);

  useEffect(() => {
    if (!competition?.current?.preferences?.competitorScores) {
      setActiveTabKey("1");
    }
  }, [competition?.current?.preferences?.competitorScores]);

  const [showScore, setShowScore] = useState(false);
  useEffect(() => {
    setShowScore(competition?.current?.preferences?.roundScores);
  }, [competition?.current?.preferences?.roundScores]);

  const validForLeaderboard = (containers) => {
    let array = [];
    [...containers].forEach((item) => {
      item.forEach((innerItem) => {
        array.push(innerItem);
      });
    });

    if (array.filter((item) => item.score != 0).length >= 2) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="participantDashboard">
      <div className="participantDashboardHeader">
        <div className="participantInfo">
          {!container?.current?.emojiObject ? (
            <Avatar src={container?.current?.imageURL} />
          ) : (
            <p
              className="participantEmoji"
              style={{ fontSize: 40, marginBottom: 0 }}
            >
              {container?.current?.emojiObject?.emoji}
            </p>
          )}
          <Typography.Text className="participantCode">
            {container?.current?.containerName}
          </Typography.Text>
          {competition?.current?.preferences?.roundScores && (
            <div className="participantTotalPoints">
              <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684834403149_image_164.png" />
              <label>
                {calculatePoint(container?.current).toFixed(3)}
                {/* {`${
                isNaN(container.points) ? 0 : container.points.toFixed(3) || 0
              }`} */}
              </label>
            </div>
          )}
        </div>
        <Typography.Text className="participantsDashboardOptionText">
          <div className="participantsDashboardOptionIconWrap">
            {competition?.current?.emojiObject ? (
              <p className="participantsDashboardCategoryIcon">
                {competition?.current?.emojiObject?.emoji}
              </p>
            ) : (
              <Avatar src={competition?.current?.imageURL} />
            )}
            {competition?.current?.status &&
              competition.current.status !== "ACTIVE" && (
                <>
                  <div className="statusIcon visibleMobile">
                    <Image
                      preview={false}
                      src={
                        competition.current.status === "CONCLUDED"
                          ? "https://rethink-competitions.s3.amazonaws.com/1678046766997_CONCLUDED.svg"
                          : "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1678046801946_ABANDONED.svg"
                      }
                      alt={competition.current.status}
                    />
                  </div>
                </>
              )}
          </div>
          <div className="participantsDashboardOptionTextWrap">
            <strong className="comName">
              {competition?.current?.competitionName}
            </strong>{" "}
            <span className="participantsDashboardCategoryname">
              {competition?.current?.category?.categoryName}
            </span>
            {competition?.current?.status &&
              competition.current.status !== "ACTIVE" && (
                <>
                  <div className="compStatus hiddenMobile">
                    <div className="statusIcon">
                      <Image
                        preview={false}
                        src={
                          competition.current.status === "CONCLUDED"
                            ? "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1669055225239_concludeFlag.svg"
                            : "https://rethink-competitions.s3.amazonaws.com/1669756188810_abandon.svg"
                        }
                        alt={competition.current.status}
                      />
                    </div>
                    <span className="statusText">
                      {competition.current.status === "CONCLUDED"
                        ? "CONCLUDED"
                        : "ABANDONED"}
                    </span>
                  </div>
                </>
              )}
          </div>
        </Typography.Text>
      </div>
      <Tabs
        className="participantsDashboardTabs"
        activeKey={activeTabKey}
        onChange={(e) => {
          setActiveTabKey(e);
        }}
      >
        <Tabs.TabPane tab="Timeline" key="1">
          {isValidRegistrationFlag ? (
            <Timeline
              timelineEvents={timelineEvents}
              setActiveTabKey={setActiveTabKey}
              setSubmissionSelected={setSubmissionSelected}
              competition={competition?.current}
              container={container?.current}
              user={user}
            />
          ) : (
            <div className="judges-empty-state">
              <div className="state-img">
                <Image
                  src="https://rethink-competitions.s3.amazonaws.com/1680515802080_imgtimeline.png"
                  alt=""
                  preview={false}
                />
              </div>
              <Typography.Text className="heading">
                {/* Unlock competition timeline by completing your team registration */}
                {emptyStateText(
                  competition?.current,
                  container?.current,
                  "timeline"
                )}
              </Typography.Text>
              <div className="participantProgressBlock">
                {competition?.current?.competitionType === "TEAM" &&
                  !container?.lockRegistration && (
                    <ProgressBar
                      competition={competition?.current}
                      container={container?.current}
                    />
                  )}
              </div>
              {competition?.current?.competitionType !== "SOLO" && (
                <Button onClick={() => setActiveTabKey("6")}>
                  {/* Take me to my team */}
                  My Team
                  <ArrowLinkIcon />
                </Button>
              )}
            </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Scores" key="2">
          {isValidRegistrationFlag ? (
            <Scores
              competition={competition?.current}
              container={container?.current}
            />
          ) : (
            <div className="judges-empty-state">
              <div className="state-img">
                <Image
                  src="https://rethink-competitions.s3.amazonaws.com/1680515724356_imgscore.png"
                  alt=""
                  preview={false}
                />
              </div>
              <Typography.Text className="heading">
                {/* Unlock transparent scores by completing your team registration */}
                {emptyStateText(
                  competition?.current,
                  container?.current,
                  "scores"
                )}
              </Typography.Text>
              <div className="participantProgressBlock">
                {competition?.current?.competitionType === "TEAM" &&
                  !container?.lockRegistration && (
                    <ProgressBar
                      competition={competition?.current}
                      container={container?.current}
                    />
                  )}
              </div>
              {competition?.current?.competitionType !== "SOLO" && (
                <Button onClick={() => setActiveTabKey("6")}>
                  {/* Take me to my team */}
                  My Team
                  <ArrowLinkIcon />
                </Button>
              )}
            </div>
          )}
        </Tabs.TabPane>

        {/* <Tabs.TabPane tab="Submissions" key="3">
          {isValidRegistrationFlag ? (
            <Submission
              container={container.current}
              submissionSelected={submissionSelected}
              setSubmissionSelected={setSubmissionSelected}
              participantSide={true}
              pusher={pusher}
            />
          ) : (
            <div className="judges-empty-state">
              <div className="state-img">
                <Image
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1680515772376_imgsubmition.png"
                  alt=""
                  preview={false}
                />
              </div>
              <Typography.Text className="heading">

                {emptyStateText(
                  competition?.current,
                  container?.current,
                  "submissions"
                )}
              </Typography.Text>
              <div className="participantProgressBlock">
                {competition?.current?.competitionType === "TEAM" &&
                  !container?.lockRegistration && (
                    <ProgressBar
                      competition={competition?.current}
                      container={container?.current}
                    />
                  )}
              </div>
              {competition?.current?.competitionType !== "SOLO" && (
                <Button onClick={() => setActiveTabKey("6")}>
                  My Team
                  <ArrowLinkIcon />
                </Button>
              )}
            </div>
          )}
        </Tabs.TabPane> */}
        <Tabs.TabPane tab="Tasks" key="3">
          {isValidRegistrationFlag ? (
            <TasksForParticipant
              competition={competition?.current}
              container={container?.current}
              pusher={pusher}
            />
          ) : (
            <div className="judges-empty-state">
              <div className="state-img">
                <Image
                  width={114}
                  height={127}
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1688407002465_image_404.png"
                  alt=""
                  preview={false}
                />
              </div>
              <Typography.Text className="heading">
                {/* Unlock transparent scores by completing your team registration */}
                {emptyStateText(
                  competition?.current,
                  container?.current,
                  "tasks"
                )}
              </Typography.Text>
              <div className="participantProgressBlock">
                {competition?.current?.competitionType === "TEAM" &&
                  !container?.lockRegistration && (
                    <ProgressBar
                      competition={competition?.current}
                      container={container?.current}
                    />
                  )}
              </div>
              {competition?.current?.competitionType !== "SOLO" && (
                <Button onClick={() => setActiveTabKey("6")}>
                  {/* Take me to my team */}
                  My Team
                  <ArrowLinkIcon />
                </Button>
              )}
            </div>
          )}
        </Tabs.TabPane>
        {/* {competition?.current?.preferences?.competitorScores && ( */}
        {/* <Tabs.TabPane
          // container?.current?.leaderboard?.autoUpdate ? "Live" : ""
          tab={
            <div className="leaderboardTabLink">
              {isAutoUpdate && (
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1686161900296_Untitled2.png"
                  alt="asdas"
                />
              )}{" "}
              Leaderboard
            </div>
          }
          key="5"
          // closeIcon={<img src="https://rethink-competitions.s3.amazonaws.com/1686161900296_Untitled2.png" alt=""/>}
          // disabled={!competition?.current?.preferences?.competitorScores}

          // <img src="https://rethink-competitions.s3.amazonaws.com/1686161900296_Untitled2.png" alt=""/>
          // className={` ${
          //   competition?.current?.preferences?.competitorScores ? "liveDot" : ""
          // }`}
        >
          {!!containers.length &&
          containers?.[0]?.[0]?.score != 0 &&
          competition?.current?.preferences?.competitorScores ? (
            !load ? (
              <div className="leaderboardPage">
                <LeaderBoardHeader
                  leaderboard={leaderboard}
                  container={containers.slice(0, 3)}
                  setContainers={(cont) => setContainers(cont)}
                  publicLeaderboard={false}
                  competition={competition?.current}
                  participantSide={true}
                  showScore={showScore}
                />

                <LeaderBoardContent
                  container={containers}
                  setContainers={setContainers}
                  leaderboard={leaderboard}
                  showScore={showScore}
                />
              </div>
            ) : (
              <Skeleton loading={true} avatar />
            )
          ) : (
            <div className="leaderboardPageEmptyState judges-empty-state">
              <div className="state-img">
                <Image
                  alt="Leaderboard Image"
                  preview={false}
                  src={leaderboardEmptyState}
                />
              </div>
              {competition?.current?.competitionType == "TEAM" ? (
                <>
                  {" "}
                  <Typography.Text className="heading">
                    <span>Lock Registrations</span> to get access to the
                    Leaderboard
                  </Typography.Text>
                  <div className="participantProgressBlock">
                    <Typography.Text>
                      <ProgressBar
                        competition={competition?.current}
                        container={container?.current}
                      />
                    </Typography.Text>
                  </div>
                  {competition?.current?.competitionType !== "SOLO" && (
                    <Button onClick={() => setActiveTabKey("6")}>
                      My Team
                      <ArrowLinkIcon />
                    </Button>
                  )}
                </>
              ) : (
                <Typography.Text className="heading">
                  You may preview the leaderboard when participants begin
                  getting scored
                </Typography.Text>
              )}
            </div>
          )}
        </Tabs.TabPane> */}
        {/* )} */}
        {competition?.current?.competitionType !== "SOLO" && (
          <Tabs.TabPane tab="My Team" key="6">
            <MyTeam
              container={container?.current}
              users={container?.current?.users}
              competition={competition?.current}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
      {/* {!competition?.current && loadDone && ( */}
      <NoAccessModal
        isOpen={isNoAccessModalOpen}
        onCancel={() => {
          dispatch(clearPersistConfig());
          router.push("/auth/dashboard");
          dispatch(getAllCompetitionsParticipated());
          setIsNoAccessModalOpen(false);
        }}
        container={container?.current}
      />
      {/* )} */}
    </div>
  );
};

export default ParticipantsV2;
