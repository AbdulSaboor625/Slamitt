import SegmentHandler from "../../analytics/segment";
import Api from "../../services";
import { ERROR_CODES, roundStatus, routes } from "../../utility/config";
import {
  CLEAR_COMPETITION_STATE,
  CLEAR_ROUND,
  CREATE_OR_UPDATE_COMPETITION,
  CREATE_ROUND,
  DRAG_AND_DROP_ROUNDS,
  GET_ALL_COMPETITIONS_ORGANIZED,
  GET_ALL_COMPETITIONS_PARTICIPATED,
  GET_ALL_ROUNDS,
  GET_ALL_ROUNDS_PARTICIPATED,
  GET_CATEGORY_AND_SUB_CATEGORY,
  GET_SINGLE_ROUND,
  REMOVE_ASSESSMENT_CRITERIA,
  SELECT_ASSESSMENT_CRITERIA,
  SET_COMPETITION_SELECTED,
  SET_CONTAINER_ACTIVE,
  SET_ROUND_SELECTED_PARTICIPATED,
  SET_ROUND_STATUS,
} from "../actionTypes";
import { store } from "../store";
import { clearPersistConfig } from "./configActions";
import {
  getAllContainers,
  getQualifiedContainers,
  getSingleContainer,
} from "./containerActions";
import { notify } from "./notificationActions";
import { useRouter } from "next/router";
import { useState } from "react";

export const addOrUpdateCompetitionDetails = (payload) => {
  const obj = {};
  if (payload.image) obj.image = payload.image;
  if (payload.competitionName || payload.competitionName === "")
    obj.competitionName = payload.competitionName;
  if (payload.categoryName) obj.categoryName = payload.categoryName;
  if (payload.subCategories) obj.subCategoryArray = payload.subCategories;
  if (payload.competitionType) obj.competitionType = payload.competitionType;
  if (payload.teamSize) obj.teamSize = payload.teamSize;
  if (payload.minTeamSize) obj.minTeamSize = payload.minTeamSize;

  return {
    type: CREATE_OR_UPDATE_COMPETITION,
    ...obj,
  };
};

export const getCategoryAndSubCategory = () => {
  return async (dispatch) => {
    try {
      const response = await Api.get("/category/");
      if (response.code && response.result) {
        const categoryCodes = Object.keys(response.result);
        const category = [];
        categoryCodes.forEach((categoryCode) => {
          const obj = {};
          obj.subCategory = response.result[categoryCode].map((item) => {
            return { ...item, isSelected: false };
          });
          obj.colorCode = response.result[categoryCode][0].colorCode;
          obj.categoryName = response.result[categoryCode][0].categoryName;
          obj.categoryCode = categoryCode;
          obj.isSelected = false;
          obj.imageUrl = response.result[categoryCode][0].imageUrl;
          obj.label = response.result[categoryCode][0].categoryName;
          obj.value = JSON.stringify(obj.subCategory);
          category.push(obj);
        });
        // console.log(category);
        // const categories = Object.keys(response.result).map((key) => {
        //   subCategories.push(...response.result[key]);
        //   return {
        //     label: response.result[key][0].categoryName,
        //     value: response.result[key][0].categoryCode,
        //     ...response.result[key][0],
        //   };
        // });
        dispatch({
          type: GET_CATEGORY_AND_SUB_CATEGORY,
          categories: category,
          subCategories: [],
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

export const setRoundStatus = (payload) => {
  return {
    type: SET_ROUND_STATUS,
    status: payload.status,
  };
};

export const getAllCompetitionsParticipated = () => {
  return async (dispatch) => {
    try {
      const response = await Api.get(`/competition/participated`);

      if (response.code && response.result) {
        dispatch({
          type: GET_ALL_COMPETITIONS_PARTICIPATED,
          competitions: response.result,
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

export const getAllCompetitionsOrganized = () => {
  return async (dispatch) => {
    try {
      const response = await Api.get(`/competition/organized`);
      if (response.code && response.result) {
        dispatch({
          type: GET_ALL_COMPETITIONS_ORGANIZED,
          competitions: response.result,
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

export const createRooms = (payload) => {
  return async (dispatch) => {
    try {
      const response = await Api.post("/room/createRoom", payload);
      if (response.code && response.result) {
        dispatch(
          notify({
            message: response.message,
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

export const setCompetition = (payload) => {
  return {
    type: SET_COMPETITION_SELECTED,
    competition: payload,
  };
};

export const getCompetitionByCompetitionCode = (payload) => {
  const userCode = store.getState().auth.user?.userCode;
  return async (dispatch) => {
    try {
      const response = await Api.get(`/competition/${payload.competitionCode}`);
      if (response.code && response.result) {
        if (payload.crew) {
          const crewUser = response.result.crew.find(
            (cr) => cr?.userCode === userCode
          );
          if (crewUser) {
            response.result.crewUser = crewUser;
            dispatch({
              type: SET_COMPETITION_SELECTED,
              competition: response.result,
            });
          } else {
            dispatch(
              notify({
                type: "error",
                code: ERROR_CODES.CREW_NOT_PRESENT,
                message: `You are not a crew member for ${response.result.competitionName}`,
              })
            );
            window.location.href = routes.pageNotFound;
          }
          return;
        }

        dispatch({
          type: SET_COMPETITION_SELECTED,
          competition: response.result,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error.message !== "No Competition Found!") {
        dispatch(
          notify({
            message: error.message,
            type: "error",
          })
        );
      } else {
        window.location.href = routes.dashboard;
      }
    }
  };
};

export const getAllRounds = ({ cCode = "", initial = false }) => {
  const roundState = store.getState().competition.round;
  const competition = store.getState().competition.current;
  return async (dispatch) => {
    try {
      const response = await Api.get(
        `/round/${cCode || competition.competitionCode}`
      );
      // const response = await Api.get(`/round/prayas-2022`);
      if (response.code && response.result) {
        const rounds = response?.result.map((round) => {
          const randomColor = Math.floor(Math.random() * (19 - 0 + 1)) + 0;
          if (round.isLive) {
            return {
              ...round,
              roundColor: randomColor,
              label: round.roundName,
              value: round.roundCode,
            };
          } else return round;
        });

        let round = false;

        if (roundState?.details?.competitionRoundCode) {
          round = rounds.filter(
            (r) =>
              r.competitionRoundCode === roundState.details.competitionRoundCode
          );
          if (round && round.length) {
            round = {
              status: round[0].isLive ? roundStatus.LIVE : roundStatus.DRAFT,
              details: round[0],
            };
          }
        }

        dispatch({
          type: GET_ALL_ROUNDS,
          rounds: rounds,
          round: round,
        });
      } else {
        throw new Error(response.message);
      }
      if (initial && response.result.length) {
        dispatch(getSingleRound(response?.result[0]));
      } else if (initial) {
        dispatch(clearRound());
      }
    } catch (error) {
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const createRound = (payload) => {
  return async (dispatch) => {
    try {
      const response = await Api.post("/round/createRound", payload);
      if (response.code && response.result) {
        dispatch({
          type: CREATE_ROUND,
          round: response.result,
        });
        dispatch(getAllRounds({ cCode: "" }));
        dispatch(
          notify({
            message: response.message,
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

export const getSingleRound = (payload) => {
  return {
    type: GET_SINGLE_ROUND,
    round: payload,
  };
  // return async (dispatch) => {
  //   try {
  //     const response = await Api.get(
  //       `/round/code/${payload.competitionRoundCode}`
  //     );
  //     if (response.code && response.result) {
  //       dispatch({
  //         type: GET_SINGLE_ROUND,
  //         round: response.result,
  //       });
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error) {
  //     dispatch(
  //       notify({
  //         message: error.message,
  //         type: "error",
  //       })
  //     );
  //   }
  // };
};

export const updateRound = (payload) => {
  console.log("payload", payload);
  const round = store.getState().competition.round;
  let room = store.getState().rooms.selected;
  const containerSelected = store.getState().containers.current;
  let data = {};
  if (payload.type) data.type = payload.type;
  if (payload.maxPoints || payload.maxPoints === null)
    data.maxPoints = payload.maxPoints;
  if (payload.roundName) data.roundName = payload.roundName;
  if (payload.submissionsSettings)
    data.submissionsSettings = payload.submissionsSettings;
  if (payload.criteria) data.assessmentCriteria = payload.criteria;
  if (payload.roundWeightage >= 0) data.roundWeightage = payload.roundWeightage;
  if (payload.assignedRoomCode)
    data.assignedRoomCode = payload.assignedRoomCode;
  if (payload.isLive === null || payload.isLive === undefined)
    data.isLive = round.details.isLive;
  else data.isLive = payload.isLive;
  if (payload.allowJudgeEntry === true || payload.allowJudgeEntry === false)
    data.allowJudgeEntry = payload.allowJudgeEntry;
  if (
    payload.allowParticipantsForSubmission === true ||
    payload.allowParticipantsForSubmission === false
  )
    data.allowParticipantsForSubmission =
      payload.allowParticipantsForSubmission;

  if (payload.imageURL) {
    data.imageURL = payload.imageURL;
    data.emojiObject = null;
  }
  if (payload.emojiObject) {
    data.emojiObject = payload.emojiObject;
    data.imageURL = null;
  }
  if (payload.sortingOrder) data.sortingOrder = payload.sortingOrder;

  return async (dispatch) => {
    try {
      const response = await Api.update(
        `/round/${payload.competitionRoundCode}`,
        data
      );
      if (response.code && response.result) {
        dispatch({
          type: GET_SINGLE_ROUND,
          round: response.result,
        });
        dispatch(getAllRounds({ cCode: "" }));
        dispatch(getAllContainers(room));
        dispatch(getQualifiedContainers());
        containerSelected?.containerCode &&
          dispatch(getSingleContainer(containerSelected.containerCode));
        payload.submissionsSettings &&
          dispatch(
            notify({ type: "success", message: "Submissions settings updated" })
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

export const dragandDropRounds = (rounds) => async (dispatch) => {
  try {
    const response = await Api.post(`/round/rearrangeRounds`, {
      rounds,
    });

    if (response.code && response.result) {
      dispatch({
        type: DRAG_AND_DROP_ROUNDS,
        rounds,
      });
    } else {
      dispatch(
        notify({
          message: "There was an error saving rounds order",
          type: "error",
        })
      );
    }
  } catch (err) {
    dispatch(
      notify({
        message: err.message,
        type: "error",
      })
    );
  }
};

export const updateCompetitionDetails = (props) => {
  const {
    competitionName,
    imageURL,
    emojiObject,
    status,
    teamSize,
    minTeamSize,
    competitionType,
    isVisibleRoundScores,
    isVisibleStats,
    isVisibleCompetitorScores,
    isBelongsToSameOrgOrInstitute,
    categoryArray,
    placements,
    isVisibleRoundWeightage,
    isDeleted,
    allowRegistration,
    useContainerCodePreDefined,
    interIntraConfig,
    allRounds,
  } = props;

  const {
    competitionCode,
    preferences,
    crew,
    competitionType: type,
  } = store.getState().competition.current;
  const payload = {
    crew: crew,
    preferences: {
      roundScores: preferences.roundScores,
      stats: preferences.stats,
      competitorScores: preferences.competitorScores,
      roundWeightage: preferences?.roundWeightage || false,
    },
  };
  if (isBelongsToSameOrgOrInstitute || isBelongsToSameOrgOrInstitute === false)
    payload.isBelongsToSameOrgOrInstitute = isBelongsToSameOrgOrInstitute;
  if (competitionName) payload.competitionName = competitionName;
  if (imageURL) {
    payload.imageURL = imageURL;
    payload.emojiObject = null;
  }
  if (emojiObject) {
    payload.emojiObject = emojiObject;
    payload.imageURL = null;
  }
  if (status) payload.status = status;
  if (teamSize) payload.teamSize = teamSize;
  if (minTeamSize) payload.minTeamSize = minTeamSize;
  if (type === "SOLO" && competitionType === "TEAM") {
    payload.teamSize = teamSize || 2;
    payload.minTeamSize = minTeamSize || null;
  } else if (type === "TEAM" && competitionType === "SOLO") {
    payload.teamSize = null;
    payload.minTeamSize = null;
  }
  if (interIntraConfig) payload.interIntraConfig = interIntraConfig;
  if (isVisibleRoundScores || isVisibleRoundScores === false)
    payload.preferences.roundScores = isVisibleRoundScores;
  if (isVisibleStats || isVisibleStats === false)
    payload.preferences.stats = isVisibleStats;
  if (isVisibleCompetitorScores || isVisibleCompetitorScores === false)
    payload.preferences.competitorScores = isVisibleCompetitorScores;
  if (isVisibleRoundWeightage || isVisibleRoundWeightage === false)
    payload.preferences.roundWeightage = isVisibleRoundWeightage;
  if (minTeamSize || minTeamSize === null) payload.minTeamSize = minTeamSize;
  if (competitionType) payload.competitionType = competitionType;
  if (categoryArray && categoryArray.length)
    payload.categoryArray = categoryArray;
  if (placements) payload.placements = placements;
  if (isDeleted) payload.isDeleted = isDeleted;
  if ("allowRegistration" in props)
    payload.allowRegistration = allowRegistration;
  if ("useContainerCodePreDefined" in props)
    payload.useContainerCodePreDefined = useContainerCodePreDefined;
  if (competitionType === "SOLO") {
    payload.teamSize = null;
    payload.minTeamSize = null;
  }
  if (allRounds) {
    payload = { ...payload, rounds: allRounds };
  }

  return async (dispatch, getState) => {
    try {
      const response = await Api.update(
        `/competition/${competitionCode}`,
        payload
      );
      if (response.code && response.result) {
        if (payload.allowRegistration) {
          const { segment } = getState().misc;

          const analytics = new SegmentHandler(segment);
          analytics.trackUserEvent(
            SegmentHandler.EVENTS.ALLOW_REGISTRATION,
            response.result
          );
        }
        dispatch(
          notify({
            message: response.message,
            type: "success",
          })
        );
        dispatch(setCompetition(response.result));
        if (payload.isDeleted) {
          dispatch(clearPersistConfig());
          window.location.replace(routes.dashboard);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          code: ERROR_CODES.COMPETITION_UPDATE_FAILED,
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const getCompetitionParticipatedByCompetitionCode = (payload) => {
  return async (dispatch) => {
    if (payload.callApi) {
      try {
        const response = await Api.get(
          `/competition/participated/${payload.competitionCode}`
        );
        if (response.code && response.result) {
          dispatch({
            type: GET_ALL_ROUNDS_PARTICIPATED,
            competition: response.result,
          });
          dispatch({
            type: SET_CONTAINER_ACTIVE,
            container: response.result,
          });
          dispatch({
            type: SET_COMPETITION_SELECTED,
            competition: response.result.Competition,
          });
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        window.location.href = routes.dashboard;
        dispatch(clearPersistConfig());
        dispatch(
          notify({
            message: "You have been removed from the competition!",
            type: "error",
          })
        );
      }
    } else {
      dispatch({
        type: GET_ALL_ROUNDS_PARTICIPATED,
        competition: { roundData: payload.rounds },
      });
    }
  };
};

export const selectParticipatedRound = (payload) => {
  return {
    type: SET_ROUND_SELECTED_PARTICIPATED,
    round: payload,
  };
};

export const clearCompetitionState = () => {
  return {
    type: CLEAR_COMPETITION_STATE,
  };
};

export const verifyCrewInCompetition = (competitionCode, user) => {
  const data = {
    competitionCode,
    crew: user,
  };

  return async (dispatch) => {
    try {
      const response = await Api.post(`/competition/verify-crew`, data);
      if (response.code && response.result) {
        dispatch({
          type: SET_COMPETITION_SELECTED,
          container: response.result,
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

export const selectAssesmentCriteria = (payload) => {
  return {
    type: SELECT_ASSESSMENT_CRITERIA,
    criteria: payload,
  };
};

export const removeAssesmentCriteria = (payload) => {
  return {
    type: REMOVE_ASSESSMENT_CRITERIA,
    criteria: payload,
  };
};

export const clearRound = () => {
  return {
    type: CLEAR_ROUND,
  };
};

export const updateOrAddMockRoundScores = (payload) => {
  const round = store.getState().competition.round.details;
  return async (dispatch) => {
    try {
      const response = await Api.update(
        `round/${round.competitionRoundCode}/scoring`,
        payload
      );
      if (response.code && response.result) {
        dispatch(getAllContainers());
        dispatch(
          notify({
            message: response.message,
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
