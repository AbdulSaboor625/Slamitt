import Api from "../../services";
import { routeGenerator, routes } from "../../utility/config";
import {
  ADD_JUDGE_ROUND,
  ADD_JUDGE_TOKEN,
  CLEAR_JUDGE_STATE,
  GET_ALL_ROUND_CONTAINERS,
  GET_ROUND,
  UPDATE_JUDGE,
  UPDATE_ROUND_CONTAINER,
} from "../actionTypes";
import { store } from "../store";
import { logoutJudge } from "./authActions";
import { notify } from "./notificationActions";

export const getJudge = () => {
  return async (dispatch) => {
    try {
      const response = await Api.get("/judge/getJudge");
      if (
        response.code &&
        response.result &&
        (response.result.judgeCode || response.result.status)
      ) {
        const judge = response.result;
        // if (judge.status === "JUDGED" || judge.status === "ABANDONED") {
        //   dispatch(
        //     notify({
        //       message: "You have already completed your session",
        //       type: "info",
        //     })
        //   );
        // } else
        if (judge.status === "DELETED") {
          dispatch(logoutJudge());
          dispatch(
            notify({
              message: "You were removed by the organiser",
              type: "error",
            })
          );
          window.location.replace(routes.login);
        } else {
          dispatch({
            type: UPDATE_JUDGE,
            judge: response.result,
          });
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log("###", error);
      dispatch({
        type: UPDATE_JUDGE,
        judge: {},
      });
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const judgeSignup = (payload) => {
  return async (dispatch) => {
    try {
      const response = await Api.post("/judge/judgeSignup", payload);
      if (response.code && response.result.judge) {
        const judge = response.result.judge;
        if (
          judge &&
          (judge.status === "JUDGED" || judge.status === "ABANDONED")
        ) {
          dispatch(
            notify({
              message: "You have already completed your session",
              type: "info",
            })
          );
        } else {
          dispatch({
            type: ADD_JUDGE_TOKEN,
            judgeToken: response.result?.token,
          });
          dispatch({
            type: ADD_JUDGE_ROUND,
            round: payload.round,
            judge,
          });
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const getCompetitionRound = (competitionRoundCode) => {
  return async (dispatch) => {
    try {
      const response = await Api.get(`/round/code/${competitionRoundCode}`);
      if (response.code && response.result) {
        dispatch({
          type: GET_ROUND,
          round: response.result,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log("###", error);
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const getAllRoundContainers = (setIsSyncing = null) => {
  const judgeState = store.getState().judge;
  const { judge, round } = judgeState;
  const judgeCode = judge?.judgeCode;

  return async (dispatch) => {
    try {
      if (round && round.roundCode) {
        const {
          roundCode,
          competitionCode,
          assignedRoomCode,
          assessmentCriteria,
        } = round;
        const competitionRoomCode = `${competitionCode}-${assignedRoomCode}`;
        const containersResponse = await Api.get(
          `/container/${competitionRoomCode}`
        );
        if (containersResponse && containersResponse.result) {
          let containers = containersResponse.result;
          let assessment = [];
          assessmentCriteria.forEach(
            ({ label, points, isCustom, isDeleted, skillSubSkillCode }) => {
              if (!isDeleted)
                assessment.push({
                  label,
                  points: null,
                  isCustom,
                  endorse: false,
                  skillSubSkillCode,
                });
            }
          );

          containers = containers.map((container) => {
            let updatedContainer = "";
            if (container.roundData && container.roundData.length) {
              container.roundData.map((round) => {
                if (round.roundCode === roundCode) {
                  if (round.roundScore && round.roundScore.length) {
                    round.roundScore.map((judgeScore) => {
                      if (judgeScore.judgeCode === judgeCode)
                        updatedContainer = {
                          ...container,
                          assessment: judgeScore.assessment,
                          feedback: judgeScore.feedback,
                          scored: !judgeScore.assessment.filter(
                            (cr) => cr.points === null
                          ).length,
                        };
                    });
                  }
                }
              });
            }

            if (updatedContainer) return updatedContainer;
            return JSON.parse(
              JSON.stringify({
                ...container,
                assessment,
                feedback: {
                  audio: "",
                  text: "",
                },
                scored: false,
                submit: false,
              })
            );
          });
          dispatch({
            type: GET_ALL_ROUND_CONTAINERS,
            containers,
          });

          if (setIsSyncing) setIsSyncing(false);
        } else {
          throw new Error(containersResponse.message);
        }
      } else {
        throw new Error("Round not found!");
      }
    } catch (error) {
      console.log("###", error);
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const updateRoundContainer = (payload) => {
  const judgeState = store.getState().judge;
  const { round, judge, containers } = judgeState;

  const updatedContainers = containers.map((container) => {
    const updatedContainer = payload.containers.find(
      (c) => c.containerCode === container.containerCode
    );
    if (updatedContainer) {
      const isNotScored = updatedContainer.assessment.filter(
        (cr) => cr.points === null
      ).length;
      return {
        ...updatedContainer,
        scored: Boolean(payload.callApi && !isNotScored),
      };
    } else return container;
  });

  localStorage.setItem("containers", JSON.stringify(updatedContainers));

  const data = {
    containers: payload.containers,
    judgeCode: judge.judgeCode,
    roundCode: round.roundCode,
  };

  return async (dispatch) => {
    try {
      if (payload.callApi) {
        const response = await Api.update(
          `round/${round.competitionRoundCode}/scoring`,
          data
        );
        if (response.code && response.result) {
          dispatch({
            type: UPDATE_ROUND_CONTAINER,
            containers: updatedContainers,
          });
        } else {
          throw new Error(response.message);
        }
      } else {
        dispatch({
          type: UPDATE_ROUND_CONTAINER,
          containers: updatedContainers,
        });
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const submitScores = (payload) => {
  const containers = payload.containers;
  const judgeState = store.getState().judge;
  const { round, judge } = judgeState;

  const data = {
    containers: containers,
    judgeCode: judge.judgeCode,
    roundCode: round.roundCode,
    sessionTimer: payload.sessionTimer,
  };

  return async (dispatch) => {
    try {
      const response = await Api.update(
        `round/${round.competitionRoundCode}/submit`,
        data
      );
      if (response.code && response.result) {
        dispatch({
          type: UPDATE_ROUND_CONTAINER,
          containers: containers,
        });
        await dispatch(updateJudge({ status: "JUDGED" }));

        const newRoute = routeGenerator(
          routes.judgeLogin,
          {
            competitionRoundCode: payload.competitionRoundCode,
          },
          true
        );
        window.location.replace(`${newRoute}?submitted=true`);
        setTimeout(() => {
          dispatch(logoutJudge());
          dispatch(clearJudgeState());
          localStorage.removeItem("containers");
          localStorage.removeItem("judgeState");
        }, 1000);

        dispatch(
          notify({
            message: "Scores submitted successfully!",
            type: "success",
          })
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const updateJudge = (payload) => {
  return async (dispatch) => {
    try {
      const response = await Api.update(`/judge/updateJudge`, payload);
      if (response.code && response.result) {
        if (payload.status === "LOGGED OUT")
          dispatch({
            type: UPDATE_JUDGE,
            judge: {},
          });
        else
          dispatch({
            type: UPDATE_JUDGE,
            judge: response.result,
          });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};
export const judgeLogoutSocket = (payload) => {
  return async (dispatch) => {
    try {
      const response = await Api.update(`/judge/judgeLogoutSocket`, payload);
      if (response.code && response.result) {
        dispatch({
          type: UPDATE_JUDGE,
          judge: response.result,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log("###", error);
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const uploadAudioFeedback = (payload, containerCode) => {
  const judgeState = store.getState().judge;
  const { containers } = judgeState;

  const formData = new FormData();
  formData.append("file", payload);

  return async (dispatch) => {
    try {
      const response = await Api.post(`/upload/single`, formData);
      if (response.code && response.result && response.result.key) {
        const container = containers.filter(
          (container) => container.containerCode === containerCode
        )[0];
        container.feedback.audio = response.result.key;
        dispatch(
          updateRoundContainer({ containers: [container], callApi: true })
        );
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const clearJudgeState = () => {
  localStorage.removeItem("OAUTH2_LINKEDIN_CODE");
  return {
    type: CLEAR_JUDGE_STATE,
  };
};
