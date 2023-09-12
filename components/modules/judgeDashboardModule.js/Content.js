import { Avatar, Image, Input, Modal, Skeleton, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearJudgeState,
  getAllRoundContainers,
  getCompetitionRound,
  getJudge,
  logoutJudge,
  notify,
  submitScores,
  updateJudge,
  updateRoundContainer,
} from "../../../Redux/Actions";
import {
  ADD_JUDGE_ROUND,
  UPDATE_ROUND_CONTAINER,
} from "../../../Redux/actionTypes";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { getPresenceChannelName, titleCase } from "../../../utility/common";
import { routeGenerator, routes, socketEvents } from "../../../utility/config";
import { CrossIcon, SearchIcon } from "../../../utility/iconsLibrary";
import { judgeSelfInviteModal } from "../../../utility/imageConfig";
import ScoringModule from "./ScoringModule";
const Content = ({
  isOnline,
  setIsOnline,
  competitionRoundCode,
  sessionTimer,
  pusher,
  setPusherChannel,
  pusherChannel,
}) => {
  const router = useRouter();
  const judgeState = useSelector((state) => state.judge);
  console.log(judgeState);
  const judgeToken = useSelector((state) => state.auth.judgeToken);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isJudgeInviteModalVisible, setIsJudgeInviteModalVisible] =
    useState(true);
  const [isMobileSearchShowing, setIsMobileSearchShowing] = useState(false);
  const [search, setSearch] = useState("");

  const isMobile = useMediaQuery("(max-width: 1023px)");

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(
  //     notify({
  //       type: "info",
  //       message: "Setting up your Dashboard...",
  //     })
  //   );
  // }, []);

  const handleSessionTerminate = (payload) => {
    if (
      judgeState &&
      judgeState.judge &&
      judgeState.judge.judgeCode === payload.judgeCode &&
      payload.competitionRoundCode === competitionRoundCode
    ) {
      dispatch(
        notify({
          type: "info",
          message: "You have logged in from some other device!",
        })
      );
      dispatch(logoutJudge());
      dispatch(clearJudgeState());
      router.replace(
        routeGenerator(routes.judgeLogin, {
          competitionRoundCode: competitionRoundCode,
        })
      );
    }
  };

  useEffect(() => {
    const urlHasJudge = location.pathname
      .split("/")
      .filter((path) => path === "judge").length;

    if (!(judgeState.judge && judgeState.judge.judgeCode) && urlHasJudge) {
      const oldJudgeState = localStorage.getItem("judgeState");

      if (oldJudgeState) {
        const { judge, round } = JSON.parse(oldJudgeState);
        dispatch({
          type: ADD_JUDGE_ROUND,
          judge,
          round,
        });
        if (judge.status !== "JUDGED" && judgeToken)
          dispatch(updateJudge({ status: "JUDGING" }));
      } else {
        dispatch(getJudge());
      }
    }
  }, []);

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem("judgeState", JSON.stringify(judgeState));
      localStorage.setItem("sessionTimer", JSON.stringify(sessionTimer));
      // dispatch(logout());
    };

    return () => {
      window.onbeforeunload = null;
    };
  });

  useEffect(() => {
    if (judgeState.judge.status === "DELETED") {
      dispatch(logoutJudge());
      localStorage.removeItem("judgeState");
      localStorage.removeItem("containers");
      dispatch(clearJudgeState());
      router.replace(
        routeGenerator(routes.judgeLogin, {
          competitionRoundCode: competitionRoundCode,
        })
      );
    } else if (judgeState.judge.status != "JUDGING") {
      if (judgeState.judge.status !== "JUDGED" && judgeToken)
        dispatch(updateJudge({ status: "JUDGING" }));
    }
  }, [judgeState.judge && judgeState.judge.status]);

  useEffect(() => {
    if (
      !(judgeState && judgeState.round && judgeState.round.roundCode) &&
      competitionRoundCode
    ) {
      dispatch(getCompetitionRound(competitionRoundCode));
    }
  }, [competitionRoundCode]);

  useEffect(() => {
    if (judgeState.round && judgeState.round.roundCode) {
      const competitionRoomCode = `${judgeState.round.competitionCode}-${judgeState.round.assignedRoomCode}`;
      const channel = pusher.subscribe(
        getPresenceChannelName(competitionRoomCode)
      );
      console.log("channel", channel);

      channel.bind("pusher:subscription_succeeded", (members) => {
        if (judgeToken)
          dispatch(
            updateJudge({
              socketId: members.me.id,
            })
          );
      });

      channel.bind("receive_message", (payload) => {
        console.log("payload", payload);
        if (payload.event === socketEvents.room_containers_update)
          dispatch(getAllRoundContainers(setIsSyncing));
        else if (payload.event === socketEvents.judge_status_update)
          dispatch(getJudge());
        else if (payload.event === socketEvents.judge_terminate_sessions)
          handleSessionTerminate(payload);
        else if (payload.event === socketEvents.update_submissions) {
          if (
            judgeState.round.competitionRoundCode ===
            payload.competitionRoundCode
          ) {
            dispatch(getAllRoundContainers());
          }
        } else if (
          payload.event === socketEvents.organizer_release_scores &&
          payload.judgeCode === judgeState?.judge?.judgeCode
        ) {
          dispatch(
            notify({
              type: "info",
              message: "Organizer has ended your session!",
            })
          );
          dispatch(logoutJudge());
          dispatch(clearJudgeState());
          router.replace(
            `${routeGenerator(
              routes.judgeLogin,
              {
                competitionRoundCode: judgeState?.round?.competitionRoundCode,
              },
              true
            )}?submitted=true`
          );
        } else if (
          payload.event === socketEvents.round_delete &&
          judgeState?.round?.competitionRoundCode ===
            payload.competitionRoundCode
        ) {
          dispatch(logoutJudge());
          dispatch(clearJudgeState());
          router.replace(
            `${routeGenerator(
              routes.judgeLogin,
              {
                competitionRoundCode: judgeState?.round?.competitionRoundCode,
              },
              true
            )}?deleted=true`
          );
        }
      });

      setPusherChannel(channel);

      const containers = localStorage.getItem("containers");
      if (
        containers &&
        containers.length &&
        containers[0].competitionRoomCode === competitionRoomCode
      ) {
        dispatch({
          type: UPDATE_ROUND_CONTAINER,
          containers: JSON.parse(containers),
        });
        setIsSyncing(false);
      } else {
        dispatch(getAllRoundContainers(setIsSyncing));
      }
    }
  }, [judgeState.round && judgeState.round.roundCode]);

  const onUpdateContainer = (payload) => {
    if (navigator.onLine) {
      dispatch(updateRoundContainer(payload));
    } else {
      const updatedContainers = judgeState.containers.map((container) => {
        const updatedContainer = payload.containers.find(
          (c) => c.containerCode === container.containerCode
        );
        if (!updatedContainer) return container;

        const isNotScored = updatedContainer.assessment.filter(
          (cr) => cr.points === null
        ).length;

        return {
          ...updatedContainer,
          scored: Boolean(!isNotScored),
        };
      });

      localStorage.setItem("containers", JSON.stringify(updatedContainers));
      dispatch({
        type: UPDATE_ROUND_CONTAINER,
        containers: updatedContainers,
      });
    }
  };

  const onSubmitScores = (payload) => {
    if (!navigator.onLine) {
      dispatch(
        notify({
          type: "info",
          message: "You cannot submit scores offline",
        })
      );
    } else {
      dispatch(
        submitScores({ ...payload, competitionRoundCode, sessionTimer })
      );
    }
  };

  const onAbandon = () => {
    if (!navigator.onLine) {
      dispatch(
        notify({
          type: "info",
          message: "You cannot abandon session offline",
        })
      );
    } else {
      if (judgeToken) dispatch(updateJudge({ status: "ABANDONED" }));
      localStorage.removeItem("containers");
      localStorage.removeItem("judgeState");
      dispatch(logoutJudge());
      dispatch(clearJudgeState());
      router.replace(
        routeGenerator(routes.judgeLogin, {
          competitionRoundCode: competitionRoundCode,
        })
      );
    }
  };

  useEffect(() => {
    if (!isOnline) {
      if (!judgeState.containers || !judgeState.containers.length) {
        const containers = localStorage.getItem("containers");
        if (
          containers &&
          JSON.parse(containers) &&
          JSON.parse(containers).length
        )
          dispatch({
            type: UPDATE_ROUND_CONTAINER,
            containers: JSON.parse(containers),
          });
      }
    }
  }, [isOnline]);

  useEffect(() => {
    if (isOnline && !navigator.onLine) {
      setIsOnline(false);
      setIsSyncing(true);
      dispatch(
        notify({
          type: "info",
          message: "Going Offline! Setting up Data. Do not refresh page",
        })
      );
      if (!judgeState.containers || !judgeState.containers.length) {
        const containers = localStorage.getItem("containers");
        if (containers) {
          dispatch({
            type: UPDATE_ROUND_CONTAINER,
            containers: JSON.parse(containers),
          });
        }
      }
      setTimeout(() => {
        setIsSyncing(false);
      }, 5000);
    } else if (!isOnline && navigator.onLine) {
      setIsOnline(true);
      setIsSyncing(true);
      dispatch(
        notify({
          type: "info",
          message: "Back Online! Syncing with Database",
        })
      );

      let containers = judgeState.containers;
      if (
        (!containers || !containers.length) &&
        localStorage.getItem("containers")
      ) {
        containers = JSON.parse(localStorage.getItem("containers"));
      }

      if (containers && containers.length) {
        onUpdateContainer({ containers, callApi: true });
      }

      setTimeout(() => {
        setIsSyncing(false);
      }, 5000);
    }
  }, [navigator.onLine]);

  const scores = [];
  if (judgeState && judgeState.containers) {
    judgeState.containers.forEach((container) => {
      if (container.scored) {
        let score = 0;
        container.assessment.forEach((criteria) => {
          score += +criteria.points || 0;
        });
        scores.push(score);
      }
    });
  }

  let totalScore = 0;
  let minScore = 1000000000;
  let maxScore = 0;
  let avgScore = 0;

  scores.forEach((score) => {
    if (score > maxScore) maxScore = score;
    if (score < minScore) minScore = score;
    totalScore += score;
  });

  if (minScore == 1000000000) minScore = 0;

  if (scores && scores.length)
    avgScore = (totalScore / scores.length).toFixed(2);

  if (isSyncing)
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 15,
        }}
      />
      // <div
      //   style={{
      //     position: "fixed",
      //     top: 0,
      //     left: 0,
      //     right: 0,
      //     bottom: 0,
      //     backgroundColor: "#fff8",
      //     zIndex: 9999,
      //     display: "flex",
      //     justifyContent: "center",
      //     alignItems: "center",
      //   }}
      // >
      //   <Spin size="large" />
      // </div>
    );
  return (
    <>
      <div className="judgesContent">
        {judgeState.judge &&
          judgeState.judge.email &&
          // judgeState.judge.loginType === "SELF" || "ORGANISER" &&
          !judgeState.judge.modalVisited && (
            <Modal
              centered
              visible={isJudgeInviteModalVisible}
              onOk={() => {
                setIsJudgeInviteModalVisible(false);
                if (!judgeState.judge.modalVisited)
                  dispatch(updateJudge({ modalVisited: true }));
              }}
              onCancel={() => {
                setIsJudgeInviteModalVisible(false);
                if (!judgeState.judge.modalVisited)
                  dispatch(updateJudge({ modalVisited: true }));
              }}
              footer={null}
              className="emailNotificationModal"
            >
              <div className="emailNotificationModalIcon">
                <Image
                  preview={false}
                  width={79}
                  height={100}
                  src={judgeSelfInviteModal}
                  alt="judge login mail icon"
                />
              </div>
              <Typography.Text className="emailNotificationModalText">
                {`An Email has been sent to ${judgeState.judge.email} with the Link to access your ongoing session incase you get logged out`}
              </Typography.Text>
            </Modal>
          )}
        <div className="judgesContentHeader">
          <Typography.Text className="judgesContentHeaderTitle">
            <Avatar
              src={
                judgeState.round?.imageURL &&
                !judgeState.round?.imageURL.includes("https://avataaars.io/")
                  ? judgeState.round?.imageURL
                  : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
              }
            />
            {titleCase(judgeState.round?.roundName)}
            {/* Score By Team Codes */}
          </Typography.Text>
          {isMobile && (
            <>
              {!isMobileSearchShowing ? (
                <div className="mobileSearchButton">
                  <SearchIcon onClick={() => setIsMobileSearchShowing(true)} />
                </div>
              ) : (
                <div className="JudgingSearchForm">
                  <Input
                    autoFocus={isMobileSearchShowing}
                    type="text"
                    onChange={(e) => setSearch(e.target.value.trim())}
                    className="textInput my-2"
                    value={search}
                    suffix={
                      <CrossIcon
                        onClick={() => {
                          setSearch("");
                          setIsMobileSearchShowing(false);
                        }}
                      />
                    }
                  />
                </div>
              )}
            </>
          )}

          {isMobile && search ? (
            ""
          ) : (
            <div className="judgesContentHeaderScoring">
              <div className="judgesContentHeaderScoringCol">
                <Typography.Title>
                  {String(avgScore).length === 1 ? `0${avgScore}` : avgScore}
                </Typography.Title>
                <Typography.Text>Avg Score</Typography.Text>
              </div>
              <div className="judgesContentHeaderScoringCol">
                <Typography.Title>
                  {String(maxScore).length === 1 ? `0${maxScore}` : maxScore}
                </Typography.Title>
                <Typography.Text>Highest</Typography.Text>
              </div>
              <div className="judgesContentHeaderScoringCol">
                <Typography.Title>
                  {String(minScore).length === 1 ? `0${minScore}` : minScore}
                </Typography.Title>
                <Typography.Text>Lowest</Typography.Text>
              </div>
            </div>
          )}
        </div>
        {/* <Divider plain /> */}
        {/* <Tabs className="judgesContentTabset" defaultActiveKey="1"> */}
        {/* <Tabs.TabPane tab="Round 2" key="1"> */}
        <ScoringModule
          sessionTimer={sessionTimer}
          pusherChannel={pusherChannel}
          judgeState={judgeState}
          updateContainer={onUpdateContainer}
          submitScores={onSubmitScores}
          abandon={onAbandon}
          search={search}
          setSearch={setSearch}
        />
        {/* </Tabs.TabPane> */}
        {/* <Tabs.TabPane tab="Chats" key="2">
            <ChatModule />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Details" key="3">
            <DetailsModule />
          </Tabs.TabPane> */}
        {/* </Tabs> */}
      </div>
    </>
  );
};

export default Content;
