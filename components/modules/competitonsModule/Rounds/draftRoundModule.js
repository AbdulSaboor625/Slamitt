import { ReloadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Image,
  Input,
  Modal,
  Row,
  Slider,
  Spin,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify, updateRound } from "../../../../Redux/Actions";
import Api from "../../../../services";
import {
  getCrewPermissions,
  getUniqueId,
  titleCase,
} from "../../../../utility/common";
import { CONTAINER_ROUND_CODE_LIMIT } from "../../../../utility/config";
import {
  DeleteIcon,
  DotsIcon,
  ImportSubmissionIcon,
} from "../../../../utility/iconsLibrary";
import { forgetImage } from "../../../../utility/imageConfig";
import AppCustomPicker from "../../../AppCustomPicker";
import AppDropDown from "../../../AppDropdown";
import AppSelect from "../../../AppSelect";
import ConfirmDeleteModal from "../confirmDeleteModal";
import MockRoundModule from "./MockRoundModule";
import TakeRoundLiveConfirmationModal from "./TakeRoundLiveConfirmationModal";
import AddJudgeModule from "./addJudgeModule";
import AssesementCriteriaModule from "./assesementCriteriaModule";
import Submissions from "./submissions";
import Tasks from "./tasks";

const TakeMockRoundLiveModal = ({
  isVisible,
  setIsVisible,
  competition,
  notScoredContainers,
  setMockRoundNotScoredContainers,
  setRoundLiveOrDraft,
  updateBulkMockRoundScores,
}) => {
  const isTeamCompetition = competition?.competitionType === "TEAM";
  const numContainers = notScoredContainers.length;
  let containersList = "";
  let headingText = "";
  let subHeadingText = "";

  if (numContainers === 1) {
    const notScoredContainer = notScoredContainers[0];
    headingText = `Hey looks like you forgot to score ${
      isTeamCompetition ? "Team" : "Participant"
    } ${notScoredContainer?.containerName}`;
    subHeadingText = `This ${
      isTeamCompetition ? "team" : "participant"
    } will be given 0pts if you choose to release scores by going live`;
  } else {
    headingText = `Hey looks like you forgot to score few of the ${
      isTeamCompetition ? "teams" : "participants"
    }.`;
    subHeadingText = `These ${
      isTeamCompetition ? "teams" : "participants"
    } will be given 0pts if you choose to release scores by going live.`;
  }

  if (numContainers === 1) {
    containersList = notScoredContainers.map((container) => (
      <>
        <Col
          className="mx-0 competitionScoringItem"
          span={24}
          style={{
            cursor: "pointer",
          }}
          key={container.containerCode}
        >
          <div className="competitionScoringItemHolder">
            {container.emojiObject ? (
              <p
                className="competitionScoringItemEmoji"
                style={{ fontSize: "1.5rem" }}
              >
                {container.emojiObject.emoji}
              </p>
            ) : (
              <Image
                src={container.imageURL}
                preview={false}
                width={50}
                heigth={50}
                alt="img"
              />
            )}
            <Typography.Text
              className="teamName"
              style={{ marginLeft: ".5rem" }}
            >
              {container.containerName}
            </Typography.Text>
          </div>
        </Col>
      </>
    ));
  } else {
    containersList = (
      <Col className="mx-0 forgotScoreModalImageGroup" span={24}>
        <Avatar.Group maxCount={3} size="large">
          {notScoredContainers.map((container) => (
            <>
              {container.emojiObject ? (
                <p
                  className="icoEmoji"
                  style={{
                    fontSize: "2rem",
                    display: "inline-block",
                  }}
                >
                  {container?.emojiObject?.emoji}
                </p>
              ) : (
                <Avatar
                  src={
                    container.emojiObject
                      ? container.emojiObject.emoji
                      : container.imageURL
                  }
                  key={container.containerCode}
                />
              )}
            </>
          ))}
        </Avatar.Group>
      </Col>
    );
  }

  return (
    <Modal
      className="forgotScoreModal"
      closable={true}
      visible={isVisible}
      onOk={() => {
        setIsVisible(false);
        setMockRoundNotScoredContainers([]);
      }}
      onCancel={() => {
        setIsVisible(false);
        setMockRoundNotScoredContainers([]);
      }}
      footer={false}
      style={{ borderRadius: "20px" }}
    >
      <Row justify="left">
        <Col className="mx-0" span={24}>
          <div className="forgotScoreModalImage">
            <Image preview={false} src={forgetImage} alt="notScored" />
          </div>
          <Typography.Title>{headingText}</Typography.Title>
        </Col>
        <Col className="mx-0" span={24}>
          <Typography.Text className="forgotScoreModalText">
            {subHeadingText}
          </Typography.Text>
        </Col>
        {containersList}
        <Col className="forgotScoreModalFooterButton w-100">
          <Button
            type="primary"
            className="outline"
            onClick={() => {
              updateBulkMockRoundScores([
                ...notScoredContainers.map((c) => ({ ...c, points: 0 })),
              ]);
              setRoundLiveOrDraft(true);
              setIsVisible(false);
              setMockRoundNotScoredContainers([]);
            }}
          >
            GO LIVE
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

const DraftRound = ({
  getContainers,
  readOnlyState,
  updateRoundImage,
  setRoundLiveOrDraft,
  data,
  rooms,
  competition,
  containers,
  deleteRound,
  pusher,
}) => {
  const [skills, setSkills] = useState([]);
  const [weightageEdit, setWeightageEdit] = useState(false);
  const [isCsvModalVisible, setIsCsvModalVisible] = useState(false);
  const { role, email } = useSelector((state) => state.auth.user);
  const crewPermissions = getCrewPermissions(data?.Competition?.crew, email);
  const [mockRoundNotScoredContainers, setMockRoundNotScoredContainers] =
    useState([]);
  const [isTakeMockRoundLiveModalVisible, setIsTakeMockRoundLiveModalVisible] =
    useState(false);

  rooms.all.forEach((room) => {
    room.label = `${room.roomName} (${room.containersCount || 0})`;
    room.value = room.roomCode;
  });
  const [criteria, setCriteria] = useState(data.assessmentCriteria);
  const [assignedRoomCode, setAssignedRoomCode] = useState(
    data.assignedRoomCode
  );

  const [totalPoints, setTotalPoints] = useState(0);
  const [roundWeightage, setRoundWeightage] = useState(
    data.roundWeightage || 100
  );
  const [judgesList, setJudgesList] = useState([]);
  const [isVisible, setVisible] = useState(false);
  const [isConfirmaDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);
  const [isSwitchActive, setSwitchActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roundType, setRoundType] = useState("GENERAL");
  const dispatch = useDispatch();

  const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;

  const roundTypes = [
    { label: "Judge Rating", value: "GENERAL" },
    { label: "Direct Entry", value: "MOCK" },
  ];

  const dotsMenu = [
    {
      label: "Reset Round",
      value: "reset",
      disabled: criteria?.length ? false : true,
    },
    { label: "Delete Round", value: "delete" },
  ];
  const roomsoptions = rooms.all.map((room) => {
    return {
      label: `${room?.roomName} List (${room?.containersCount ?? 0})`,
      value: room.value,
    };
  });

  useEffect(() => {
    getAllJudges();
    getSkills();
  }, [data]);

  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  // }, [isSwitchActive]);

  useEffect(() => {
    if (data) {
      pointsCalculator();
      setCriteria(data.assessmentCriteria);
      setAssignedRoomCode(data.assignedRoomCode);
      setRoundWeightage(data.roundWeightage);
    }
  }, [data]);

  const handleTakeMockRoundLive = (e) => {
    const nonScoredContainers = [];
    if (containers && containers.length) {
      containers.forEach((container) => {
        if (!container.mockRoundData || !container.mockRoundData.length)
          nonScoredContainers.push(container);
        else {
          const mockRoundDetails = container.mockRoundData.find(
            (r) => r.roundCode === data.roundCode
          );

          if (!mockRoundDetails || mockRoundDetails.roundScore === null) {
            nonScoredContainers.push(container);
          }
        }
      });

      if (nonScoredContainers?.length) {
        setMockRoundNotScoredContainers(nonScoredContainers);
        setIsTakeMockRoundLiveModalVisible(true);
      } else {
        setRoundLiveOrDraft(e);
      }
    }
  };

  useEffect(() => {
    if (data && containers) {
      pointsCalculator();
    }
  }, [containers, data]);

  async function getSkills() {
    try {
      const response = await Api.get(`/skill`);
      if (response.code && response.result) {
        setSkills([...Object.values(response.result)]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log("$$$", error);
    }
  }
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

  const _deleteRound = (round) => {
    setVisible(false);
    deleteRound(round);
  };

  const _onConfirm = async () => {
    setLoading(true);
    try {
      const resetContainers = containers?.map((c) => ({
        containerCode: c.containerCode,
        points: null,
      }));

      await _updateBulkMockRoundScores(resetContainers);
      dispatch(
        updateRound({
          maxPoints: null,
          competitionRoundCode: data?.competitionRoundCode,
        })
      );

      setTimeout(() => {
        setRoundLiveOrDraft(true);
      }, 0);
      setSwitchActive(!isSwitchActive);
    } catch {}
    setLoading(false);
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

  const _getAllJudges = () => {
    getAllJudges();
  };

  const _updateMockRoundScores = async (containerCode, points) => {
    const containers = [{ containerCode, points }];
    const payload = {
      roundCode: data.roundCode,
      containers,
    };
    try {
      const response = await Api.update(
        `/round/${data.competitionRoundCode}/scoring`,
        payload
      );
      if (response.code && response.result) {
        getContainers();
        // dispatch(
        //   notify({
        //     type: "success",
        //     message: response.message,
        //   })
        // );
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const _updateBulkMockRoundScores = async (containers) => {
    const payload = {
      roundCode: data.roundCode,
      containers,
    };
    try {
      const response = await Api.update(
        `/round/${data.competitionRoundCode}/scoring`,
        payload
      );
      if (response.code && response.result) {
        getContainers();
        dispatch(
          notify({
            type: "success",
            message: response.message,
          })
        );
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const pointsCalculator = () => {
    let total = 0;

    if (!data?.type || data.type === "GENERAL") {
      criteria.forEach((criterion) => {
        if (criterion?.points > 1000) {
          criterion.points = 1000;
        }
        total += parseInt(criterion.points || 0);
      });
    } else if (data && data.type === "MOCK") {
      if (containers && containers.length) {
        if (data?.maxPoints > 1000) {
          data.maxPoints = 1000;
        }
        total = parseInt(data?.maxPoints || 0);
      }
    }

    setTotalPoints(total);
  };

  const _addCriteria = async (custom, payload) => {
    // skills added from library will have a custom property false
    if (custom) {
      payload.id = getUniqueId();
      payload.points = null;
      payload.isCustom = true;
      // if the criteria entered is in library, then it will have a custom property false
      let flag = 0;
      data.assessmentCriteria.forEach((criteria) => {
        if (criteria.label.toLowerCase() === payload.label.toLowerCase()) {
          flag = 1;
        }
      });
      if (flag) {
        dispatch(
          notify({
            type: "error",
            message: "Criteria already exists",
          })
        );
        setCriteria([...criteria]);
        return;
      }

      skills.forEach((skill) => {
        const subSkill = skill.subSkills.find(
          (subSkill) =>
            subSkill.subSkillName.toLowerCase() === payload.label.toLowerCase()
        );
        if (subSkill) {
          payload.label = subSkill.subSkillName;
          payload.isCustom = false;
          payload.isDeleted = subSkill.isDeleted || false;
          payload.skillSubSkillCode = subSkill.skillSubSkillCode;
        }
      });
      dispatch(
        updateRound({
          criteria: [...criteria, payload],
          competitionRoundCode: data.competitionRoundCode,
        })
      );
      setCriteria([...criteria, payload]);
    } else if (custom === false) {
      const temp = [];
      payload.map((criterion) => {
        const parsedCriterion = JSON.parse(criterion);
        const obj = {};
        obj.label = parsedCriterion.label;
        obj.points = null;
        obj.isCustom = false;
        obj.isDeleted = parsedCriterion.isDeleted || false;
        obj.skillSubSkillCode = parsedCriterion.skillSubSkillCode;
        temp.push(obj);
      });
      let uniqueObjArray = [
        ...new Map(
          [...criteria, ...temp].map((item) => [item["label"], item])
        ).values(),
      ];

      dispatch(
        updateRound({
          criteria: uniqueObjArray,
          competitionRoundCode: data.competitionRoundCode,
        })
      );
      setCriteria([...criteria, ...temp]);
    }
  };

  const addOrUpdatePoints = (criterion) => {
    if (criterion.points > 100)
      dispatch(
        notify({
          type: "error",
          message: "Criteria cannot have more than 100 points",
        })
      );
    criteria.forEach((val) => {
      if (val._id === criterion._id) {
        val.points = Math.min(criterion.points, 100);
      }
    });
    setCriteria(criteria);
    dispatch(
      updateRound({
        criteria: criteria,
        competitionRoundCode: data.competitionRoundCode,
      })
    );
    pointsCalculator();
  };

  const deleteCriteria = (criterion) => {
    const temp = criteria.filter((criteria) => criteria._id !== criterion._id);
    setCriteria(temp);
    dispatch(
      updateRound({
        criteria: temp,
        competitionRoundCode: data.competitionRoundCode,
      })
    );
    pointsCalculator();
  };

  const onResetRound = () => {
    if (data?.type === "MOCK") {
      const resetContainers = containers?.map((c) => ({
        containerCode: c.containerCode,
        points: null,
      }));

      _updateBulkMockRoundScores(resetContainers);
      dispatch(
        updateRound({
          maxPoints: null,
          competitionRoundCode: data?.competitionRoundCode,
        })
      );
    } else {
      setCriteria([]);
      dispatch(
        updateRound({
          criteria: [],
          competitionRoundCode: data.competitionRoundCode,
        })
      );
    }
    pointsCalculator();
  };

  let allowLive = false;

  if (!data || data.type === "GENERAL") {
    if (criteria && criteria.length) {
      let minPoints = 101;
      criteria.forEach((c) => {
        if (!c.isDeleted) minPoints = Math.min(c.points, minPoints);
      });
      if (minPoints >= 5 && minPoints != 101) allowLive = true;
      if (competition?.crewUser) {
        allowLive = competition?.crewUser?.permissions?.takeRoundLive;
      }
    }
  } else if (data && data.type === "MOCK") {
    if (data.maxPoints) {
      let nonScoredContainers = 0;
      if (containers && containers.length) {
        containers.forEach((container) => {
          if (!container.mockRoundData || !container.mockRoundData.length)
            nonScoredContainers++;
          else {
            const mockRoundDetails = container.mockRoundData.find(
              (r) => r.roundCode === data.roundCode
            );

            if (!mockRoundDetails || mockRoundDetails.roundScore === null) {
              nonScoredContainers++;
            }
          }
        });

        if (containers && containers?.length > nonScoredContainers)
          allowLive = true;
      }
    }
  }

  const updateWeightage = (weightage) => {
    if (weightage < 0) {
      dispatch(
        notify({ type: "error", message: "Weightage must be more than 0" })
      );
    } else if (weightage > 200) {
      dispatch(
        notify({ type: "error", message: "Weightage must be less than 200" })
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

  const toolTipText = !allowLive
    ? data?.type === "MOCK"
      ? "Enter scores for atleast one participant and max points before taking this round live"
      : criteria && criteria.length
      ? `Enter all criteria weightages before taking this round live`
      : `Set up judgment criterias before taking this round live.`
    : containers.length >= 2
    ? ""
    : `There needs to be at least 2 teams/participants in the ${data?.assignedRoomCode} list before round goes live.`;

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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 240) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="roundContentBlock">
      <div className="roundContentHeader">
        <div className="roundContentInfo">
          <AppCustomPicker
            imgStyle={{ cursor: "pointer" }}
            emojiStyle={{
              fontSize: "2.7rem",
              lineHeight: "1.2",
              cursor: "pointer",
              marginRight: "15px",
            }}
            className="tabset"
            popOverClass="m-5"
            tabpaneClass="m-5"
            onImageSelected={(e) => updateRoundImage(e)}
            defaultValue={{
              type: data?.imageURL ? "LINK" : "EMOJI",
              url:
                data?.imageURL &&
                data.imageURL.includes("https://avataaars.io/")
                  ? "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                  : data.imageURL || "",
              emoji: data?.emojiObject || "",
            }}
            showClearButton={false}
          />
          <div className="roundContentText">
            {/* Round name and take live button */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-start">
                <Typography.Title
                  className="roundContentTitle"
                  editable={{
                    maxLength: CONTAINER_ROUND_CODE_LIMIT,
                    tooltip: false,
                    triggerType: ["text"],
                    onChange: (e) => {
                      dispatch(
                        updateRound({
                          roundName: e,
                          competitionRoundCode: data.competitionRoundCode,
                        })
                      );
                    },
                  }}
                >
                  {titleCase(data.roundName)}
                </Typography.Title>
                {!readOnlyState && (
                  <Tooltip
                    title={toolTipText}
                    trigger={"hover"}
                    placement="bottom"
                    color={"black"}
                  >
                    {/* <Typography.Text className="roundContentLive"> */}
                    {/* Go Live */}
                    {loading ? (
                      <Spin
                        indicator={antIcon}
                        style={{ paddingLeft: "15px" }}
                      />
                    ) : (
                      <Switch
                        checked={isSwitchActive}
                        disabled={!allowLive || containers.length < 2}
                        onChange={(e) => {
                          if (data?.type === "GENERAL") {
                            judgesList && judgesList.length
                              ? setConfirmDeleteModalVisible(true)
                              : _onConfirm();
                          } else if (data?.type === "MOCK") {
                            handleTakeMockRoundLive(e);
                          }
                        }}
                      />
                    )}
                    {/* </Typography.Text> */}
                  </Tooltip>
                )}
              </div>
            </div>
            {/* Dropdown for Round type and Rooms */}
            <div className="flex items-center roundSelectDrodownWrap">
              {/* <Typography.Text className="roundContentSubHeaderListTitle">
              Assigned to List :{" "}
            </Typography.Text> */}
              <AppSelect
                dropdownRender={(menu) => (
                  <div>
                    <div
                      style={{
                        padding: "16px 18px 14px",
                        textTransform: "uppercase",
                        color: "#AEAEAE",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Assessment type
                    </div>
                    {menu}
                  </div>
                )}
                disabled={readOnlyState}
                showArrow={!readOnlyState}
                className="overRideDropDown"
                // label={"Qualified"}
                option={roundTypes}
                iconShow={true}
                bordered={false}
                value={data.type}
                defaultValue={"Default Round"}
                onChange={(e) => {
                  // To reset Round
                  // if (data.type === "MOCK") {
                  //   const resetContainers = containers?.map((c) => ({
                  //     containerCode: c.containerCode,
                  //     points: null,
                  //   }));

                  //   _updateBulkMockRoundScores(resetContainers);
                  //   dispatch(
                  //     updateRound({
                  //       maxPoints: null,
                  //       competitionRoundCode: data?.competitionRoundCode,
                  //     })
                  //   );
                  // }

                  dispatch(
                    updateRound({
                      type: e,
                      competitionRoundCode: data.competitionRoundCode,
                    })
                  );
                }}
              />
              <span className="seperator"></span>
              <AppSelect
                dropdownRender={(menu) => (
                  <div>
                    <div
                      style={{
                        padding: "16px 18px 14px",
                        textTransform: "uppercase",
                        color: "#AEAEAE",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Connect to
                    </div>
                    {menu}
                  </div>
                )}
                disabled={readOnlyState}
                showArrow={!readOnlyState}
                // label={"Qualified"}
                option={roomsoptions}
                iconShow={true}
                bordered={false}
                value={assignedRoomCode}
                onChange={(e) => {
                  dispatch(
                    updateRound({
                      assignedRoomCode: e,
                      competitionRoundCode: data.competitionRoundCode,
                    })
                  );
                }}
              />
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
        {/* {roundType === "GENERAL" || !roundType ? ( */}
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
            <div className="roundContentStatsBox">
              <h3
                // className="roundContentStatsNumber"
                style={{ cursor: "ew-resize", userSelect: "none" }}
              >
                {!weightageEdit ? (
                  <Typography.Text
                    onClick={() => {
                      if (
                        (role === "CREW" && crewPermissions?.manageScoring) ||
                        role === "ORGANIZER"
                      )
                        if (!readOnlyState) setWeightageEdit(true);
                    }}
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
                    onBlur={(e) =>
                      updateWeightage(parseFloat(e.target.value).toFixed(2))
                    }
                    onPressEnter={(e) =>
                      updateWeightage(parseFloat(e.target.value).toFixed(2))
                    }
                  />
                )}
                <Slider
                  tooltipVisible={false}
                  value={roundWeightage}
                  max={200}
                  min={0}
                  onChange={(e) => setRoundWeightage(e)}
                  onAfterChange={(e) =>
                    dispatch(
                      updateRound({
                        roundWeightage: typeof e === "object" ? e[0] : e,
                        competitionRoundCode: data.competitionRoundCode,
                      })
                    )
                  }
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
      {readOnlyState && (
        <div className="roundJudgedStatus borderBottom">
          This round was not judged
        </div>
      )}
      <div className="roundContentSubHeader">
        {/* <Typography.Text className="roundContentSubHeaderTitle">
          Scoring
        </Typography.Text> */}
      </div>
      <div className="participantTabsContent">
        {data.type === "GENERAL" || !data.type ? (
          <div className="relative">
            {readOnlyState && !criteria?.length ? (
              <div className="roundEmptyPlaceholder">
                {/* <Divider></Divider> */}
                <Image
                  src={
                    "https://rethink-competitions.s3.amazonaws.com/1659457683722_1655731578044container.png"
                  }
                  alt="emtpy round state"
                  preview={false}
                />
                <Typography.Title level={5}>
                  {"No round details are available"}
                </Typography.Title>
              </div>
            ) : (
              <Tabs
                className={`roundSubtabset ${isScrolled ? "fixed-tabs" : ""}`}
                defaultActiveKey="1"
              >
                <Tabs.TabPane tab="Criteria" key="1">
                  <Typography.Text className="w-[80%] draftTextInfo">
                    Judge rating rounds allow you to invite judges so they may
                    score your participants for pre-defined judgement criterias.
                  </Typography.Text>
                  <AssesementCriteriaModule
                    readOnlyState={readOnlyState}
                    editMode={true}
                    addCriteria={_addCriteria}
                    criterias={criteria}
                    data={data}
                    setCriteria={setCriteria}
                    addOrUpdatePoints={addOrUpdatePoints}
                    deleteCriteria={deleteCriteria}
                    skills={skills}
                    competition={competition}
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
                    _getAllJudges={_getAllJudges}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Tasks" key="4">
                  <Tasks round={data} competition={data?.Competition} />
                </Tabs.TabPane>
                {
                  // (
                  //   data?.submissionsSettings?.guidelines?.length ||
                  //   data?.submissionsSettings?.guidelines
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
                        pusher={pusher}
                      />
                    </Tabs.TabPane>
                  )
                }
              </Tabs>
            )}
            {!readOnlyState && (
              <div>
                {role === "CREW" ? (
                  crewPermissions?.manageScoring ? (
                    <div className="roundContentNewHeader absolute top-0 right-0">
                      <DeleteRoundButton />
                      {data?.type === "GENERAL" ? (
                        criteria?.length ? (
                          <Tooltip
                            title={"Reset Round"}
                            trigger={"hover"}
                            placement="top"
                            color={"blue"}
                          >
                            <Button
                              className="roundContentSubHeaderResetButton"
                              type="ghost"
                              icon={<ReloadOutlined />}
                              onClick={onResetRound}
                            />
                          </Tooltip>
                        ) : (
                          <></>
                        )
                      ) : data?.type === "MOCK" ? (
                        <Tooltip
                          title={"Reset Round"}
                          trigger={"hover"}
                          placement="top"
                          color={"blue"}
                        >
                          <Button
                            className="roundContentSubHeaderResetButton"
                            type="ghost"
                            icon={<ReloadOutlined />}
                            onClick={onResetRound}
                          />
                        </Tooltip>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : null
                ) : (
                  <div className="roundContentNewHeader absolute top-0 right-0">
                    {role === "CREW" ? (
                      crewPermissions?.manageScoring ? (
                        <DeleteRoundButton />
                      ) : null
                    ) : (
                      <DeleteRoundButton />
                    )}
                    {data?.type === "GENERAL" ? (
                      criteria?.length ? (
                        <Tooltip
                          title={"Reset Round"}
                          trigger={"hover"}
                          placement="top"
                          color={"blue"}
                        >
                          <Button
                            className="roundContentSubHeaderResetButton"
                            type="ghost"
                            icon={<ReloadOutlined />}
                            onClick={onResetRound}
                          />
                        </Tooltip>
                      ) : (
                        <></>
                      )
                    ) : data?.type === "MOCK" ? (
                      <Tooltip
                        title={"Reset Round"}
                        trigger={"hover"}
                        placement="top"
                        color={"blue"}
                      >
                        <Button
                          className="roundContentSubHeaderResetButton"
                          type="ghost"
                          icon={<ReloadOutlined />}
                          onClick={onResetRound}
                        />
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="submissionTableBlock importScores">
            <div className="flex items-center justify-end">
              {!readOnlyState && (
                <div className="roundContentNewHeader  absolute top-0 right-0">
                  {role === "CREW" ? (
                    crewPermissions?.manageScoring ? (
                      <DeleteRoundButton />
                    ) : null
                  ) : (
                    <DeleteRoundButton />
                  )}

                  <Tooltip
                    title={"Reset Round"}
                    trigger={"hover"}
                    placement="top"
                    color={"blue"}
                  >
                    <Button
                      className="roundContentSubHeaderResetButton"
                      type="ghost"
                      icon={<ReloadOutlined />}
                      onClick={onResetRound}
                    />
                  </Tooltip>
                </div>
                // <div className="roundContentNewHeader absolute top-0 right-0">
                //   {role === "CREW" ? (
                //     crewPermissions?.manageScoring ? (
                //       <DeleteRoundButton />
                //     ) : null
                //   ) : (
                //     <DeleteRoundButton />
                //   )}
                //   <Tooltip
                //     title={"Reset Round"}
                //     trigger={"hover"}
                //     placement="top"
                //     color={"blue"}
                //   >
                //     <Button
                //       className="roundContentSubHeaderResetButton"
                //       type="ghost"
                //       icon={<ReloadOutlined />}
                //       onClick={onResetRound}
                //     />
                //   </Tooltip>
                // </div>
              )}
            </div>

            <Tabs className="roundSubtabset" defaultActiveKey="1">
              <Tabs.TabPane tab="Scores" key="1">
                {!readOnlyState && (
                  <Typography.Text className="w-[80%] draftTextInfo">
                    Direct entry allow you to set up final max points without
                    adding any criteria. Take the round live to add points and
                    update overall contestant scores.
                  </Typography.Text>
                )}
                <Divider className="roundActiveDivider" />
                {!readOnlyState && containers && containers.length > 0 ? (
                  <>
                    <div className="roundActiveScoresHead">
                      {!data.isLive && (
                        <Button
                          className="buttonImportSubmission"
                          icon={<ImportSubmissionIcon />}
                          onClick={() => setIsCsvModalVisible(true)}
                        >
                          Import Scores
                        </Button>
                      )}
                      <Typography.Text className="textEdit">
                        Tap on max points to edit it
                      </Typography.Text>
                    </div>
                    <MockRoundModule
                      isCsvModalVisible={isCsvModalVisible}
                      setIsCsvModalVisible={setIsCsvModalVisible}
                      roundCode={data.roundCode}
                      data={data}
                      containers={containers}
                      isLive={data.isLive}
                      updateMockRoundScore={_updateMockRoundScores}
                      updateBulkMockRoundScores={_updateBulkMockRoundScores}
                    />
                  </>
                ) : (
                  <>
                    {!readOnlyState && (
                      <div className="mockRoundEmptyPlaceholder">
                        <Image
                          preview={false}
                          src={
                            "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1669998370733_Group_3483.png"
                          }
                          alt="mockRoundEmpty"
                        />
                        <Typography.Title level={5}>
                          {` Add ${
                            competition?.competitionType === "TEAM"
                              ? "team"
                              : "participant"
                          } codes to assign points`}
                        </Typography.Title>
                      </div>
                    )}
                  </>
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
                    pusher={pusher}
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
      <TakeRoundLiveConfirmationModal
        isVisible={isConfirmaDeleteModalVisible}
        onConfirm={_onConfirm}
        onCancel={() => setConfirmDeleteModalVisible(false)}
      />
      <TakeMockRoundLiveModal
        isVisible={isTakeMockRoundLiveModalVisible}
        setIsVisible={setIsTakeMockRoundLiveModalVisible}
        competition={competition}
        notScoredContainers={mockRoundNotScoredContainers}
        setMockRoundNotScoredContainers={setMockRoundNotScoredContainers}
        setRoundLiveOrDraft={setRoundLiveOrDraft}
        updateBulkMockRoundScores={_updateBulkMockRoundScores}
      />
    </div>
  );
};

export default DraftRound;
