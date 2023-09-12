import { REARRANGE_CONTAINERS } from "../../Redux/actionTypes";
import Api from "../../services";
import { weightedScoreCalculator } from "../../utility/common";
import { SOMETHING_WENT_WRONG } from "../../utility/constants";

export const getAllContainers = async (competitionRoomCode) => {
  try {
    const response = await Api.get(`/container/${competitionRoomCode}`);

    if (response.code && response.result) {
      const containers = response.result;
      containers.forEach((container, idx) => {
        container.index = idx + 1;
        if (container.roundData && container.roundData.length) {
          container.roundScores = {};
          container.points = 0;
          container.roundData.forEach((round) => {
            if (round.roundScore && round.roundScore.length) {
              container.points += parseFloat(
                weightedScoreCalculator(
                  round.roundScore.filter(({ submit }) => submit),
                  round.Round.roundWeightage
                )
              );
            }
          });
        }
      });

      return containers;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const createContainerParticipant = async (newContainer) => {
  try {
    const response = await Api.post(
      "/container/create-container-participant",
      newContainer
    );
    if (response.code && response.result) {
      const container = response.result;
      return container;
    }

    if (response.message === "Container already Existed!")
      return response.message;

    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

// export const updateContainerImage = (container) => {
//   const room = store.getState().rooms.selected;
//   const current = store.getState().containers.current;
//   const data = {};
//   if (container.imageURL) {
//     data.imageURL = container.imageURL;
//     data.emojiObject = null;
//   }
//   if (container.emojiObject) {
//     data.imageURL = null;
//     data.emojiObject = container.emojiObject;
//   }
//   return async (dispatch) => {
//     try {
//       const response = await Api.update(
//         `/container/${current.containerCode}`,
//         data
//       );

//       if (response.code && response.result) {
//         dispatch(getAllContainers(room));
//         dispatch({
//           type: SET_CONTAINER_ACTIVE,
//           container: response.result,
//         });
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       dispatch(
//         notify({
//           message: error.message,
//           type: "error",
//         })
//       );
//     }
//   };
// };

export const updateContainer = async (
  containerCode,
  updateContainerBody,
  token
) => {
  try {
    const response = await Api.update(
      `/container/${containerCode}`,
      updateContainerBody,
      {
        Authorization: token ? `Bearer ${token}` : null,
        "Content-Type": "application/json",
      }
    );

    if (response.code && response.result) {
      return response.result;
    }

    return response.message;
  } catch (error) {
    console.log(error);
    return SOMETHING_WENT_WRONG;
  }
};

// export const selectOrUnselectContainer = (containerSelected, clear = false) => {
//   const container = store.getState().containers;
//   const selected = container.all.map((container) => {
//     // for bulk deselection
//     if (clear) {
//       container.isSelected = false;
//     } else {
//       if (container._id === containerSelected._id) {
//         // select the unselected container and vice versa
//         container.isSelected = !container.isSelected;
//       }
//     }
//     return container;
//   });
//   return {
//     type: SET_CONTAINER_SELECTED_OR_UNSELECTED,
//     selected,
//   };
// };

// export const setContainerActive = (container) => {
//   return {
//     type: SET_CONTAINER_ACTIVE,
//     container: container,
//   };
// };

export const deleteContainerBulk = async (competitionCode, containers) => {
  try {
    const deleteContainersBulkBody = {
      competitionCode,
      containerCodes: containers.map((c) => c.containerCode),
      isDeleted: true,
    };

    const response = await Api.update(
      "/container/bulkUpdateContainers",
      deleteContainersBulkBody
    );
    if (response.code && response.result) {
      return true;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const updateContainerBulk = async (
  competitionCode,
  containers,
  newRoomCode
) => {
  try {
    const updateContainerBulkBody = {
      competitionCode,
      containerCodes: containers.map((c) => c.containerCode),
      roomCode: newRoomCode,
    };
    const response = await Api.update(
      "/container/bulkUpdateContainers",
      updateContainerBulkBody
    );
    if (response.code && response.result) {
      return true;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const removeUserFromContainer = async (containerCode, email) => {
  try {
    const payload = {
      containerCode,
      email,
    };
    const response = await Api.post(`/container/remove-invited-user`, payload);
    if (response.code && response.result) {
      return response.result;
    } else {
      throw new Error(SOMETHING_WENT_WRONG);
    }
  } catch (error) {
    return null;
  }
};
export const rejectInvitation = async (containerCode, email) => {
  try {
    const payload = {
      containerCode,
      email,
    };
    const response = await Api.post(`/container/reject-invite`, payload);
    if (response.code && response.result) {
      return response.result;
    } else {
      throw new Error(SOMETHING_WENT_WRONG);
    }
  } catch (error) {
    return null;
  }
};

// export const makeUserAdminFromContainer = (containerCode, email) => {
//   const room = store.getState().rooms.selected;

//   return async (dispatch) => {
//     try {
//       const payload = {
//         containerCode,
//         email,
//       };
//       const response = await Api.post(`/container/make-user-admin`, payload);
//       if (response.code && response.result) {
//         dispatch(getAllContainers(room));
//         dispatch(setContainerActive(response.result));
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       dispatch(
//         notify({
//           message: error.message,
//           type: "error",
//         })
//       );
//     }
//   };
// };

export const rearrangeContainers = (
  containers,
  nameOrder = null,
  pointsOrder = null
) => {
  const room = store.getState().rooms.selected;
  const payload = {
    containers,
  };
  if (pointsOrder) payload.pointsOrder = pointsOrder;
  if (nameOrder) payload.nameOrder = nameOrder;

  return async (dispatch) => {
    try {
      const response = await Api.post(
        `/container/shuffleContainers/${room.competitionRoomCode}`,
        payload
      );
      if (response.code && response.result) {
        dispatch({
          type: REARRANGE_CONTAINERS,
          containers: response.result,
        });
      } else throw new Error(response.message);
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
  // return {
  //   type: REARRANGE_CONTAINERS,
  //   containers,
  // };
};

export const verifyUserInContainer = async (containerCode) => {
  try {
    const payload = { containerCode };
    const response = await Api.post(
      `/container/verify-container-user`,
      payload
    );
    if (response.code && response.result) {
      return { data: response.result, message: response.message };
    } else {
      throw new Error(SOMETHING_WENT_WRONG);
    }
  } catch (error) {
    return null;
  }
};

export const bulkCreateContainers = async (
  competitionCode,
  roomCode,
  competitionRoomCode,
  newContainers
) => {
  try {
    const response = await Api.post("/container/bulkCreateContainers", {
      competitionCode,
      roomCode,
      competitionRoomCode,
      containers: newContainers,
    });
    if (response.code && response.result) {
      const containers = response.result;
      return containers;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

// export const clearContainers = () => {
//   return {
//     type: CLEAR_CONTAINERS,
//   };
// };

// export const setSelectionOfContainers = () => {
//   const selection = store.getState().containers.selection;
//   return {
//     type: SET_SELECTION_FOR_CONTAINERS,
//     selection: !selection,
//   };
// };

// export const selectContainers = (containers) => {
//   return {
//     type: SELECT_CONTAINERS,
//     containers,
//   };
// };

// export const unselectContainers = () => {
//   const allContainers = store.getState().containers.all;
//   allContainers.forEach((container) => (container.isSelected = false));
//   return {
//     type: UNSELECT_CONTAINERS,
//     containers: allContainers,
//   };
// };

export const getContainer = async (containerCode) => {
  try {
    const response = await Api.get(
      `/container/get-single-container/${containerCode}`
    );
    if (response.code && response.result) {
      const container = response.result;
      return container;
    }
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const getVoiceRecodingUrl = async (data) => {
  try {
    const response = await Api.post("upload/single", data);
    if (response.code && response.result) {
      const container = response.result;
      return container;
    }
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

// export const verifyCrewInCompetition = (competitionCode, user) => {
//   const data = {
//     competitionCode,
//     users: user,
//   };

//   return async (dispatch) => {
//     try {
//       const response = await Api.post(`/container/verify-container-user`, data);
//       if (response.code && response.result) {
//         dispatch({
//           type: GET_CONTAINER,
//           container: response.result,
//         });
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       dispatch(
//         notify({
//           message: error.message,
//           type: "error",
//         })
//       );
//     }
//   };
// };

export const userPresentInContainer = async (competitionCode, email) => {
  try {
    const response = await Api.post("/container/check-user-container", {
      competitionCode,
      email,
    });
    if (response.code && response.result) {
      return response.result;
    }
    return response.message;
  } catch (error) {
    return null;
  }
};

export const checkInvitation = async (containerCode, email) => {
  try {
    const response = await Api.get(
      `/container/check-invitation/${containerCode}/${email}`
    );
    if (response.code && response.result) {
      return response.result;
    }
    return response.message;
  } catch (error) {
    return null;
  }
};

export const getFilteredContainers = async (filter = {}) => {
  try {
    const queryParams = new URLSearchParams(filter).toString();
    const response = await Api.get(
      "/container/get-all-containers/filter?" + queryParams
    );
    if (response.code && response.result) {
      return response.result;
    }
    return response.message;
  } catch (error) {
    return null;
  }
};

export const checkContainerName = async (containerName, competitionCode) => {
  try {
    const response = await Api.post(`/container/check-container-name`, {
      containerName,
      competitionCode,
    });
    // true means is unique and not occupied
    if (response.code && response.result) return true;
    return false;
  } catch (error) {
    return null;
  }
};
