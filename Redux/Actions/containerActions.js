import SegmentHandler from "../../analytics/segment";
import Api from "../../services";
import { weightedScoreCalculator } from "../../utility/common";
import {
  CLEAR_CONTAINERS,
  CREATE_CONTAINER,
  CRUD_MEMBER_CONTAINER,
  DRAG_AND_DROP_CONTAINERS,
  GET_ALL_CONTAINERS,
  GET_CONTAINER,
  REARRANGE_CONTAINERS,
  SELECT_CONTAINERS,
  SET_CONTAINERS_LIST,
  SET_CONTAINER_ACTIVE,
  SET_CONTAINER_SELECTED_OR_UNSELECTED,
  SET_QUALIFIED_CONTAINERS,
  SET_ROOM_SELECTED,
  SET_SELECTION_FOR_CONTAINERS,
  UNSELECT_CONTAINERS,
} from "../actionTypes";
import { store } from "../store";
import {
  activateUploadRequest,
  popRequest,
  pushRequest,
  uploadExceptionOccured,
} from "./configActions";
import { notify } from "./notificationActions";
import { getAllRooms } from "./roomActions";

export const getAllContainers = (selectedRoom, initial = false) => {
  let room = store.getState().rooms.selected;
  const containerState = store.getState().containers;
  if (!room && selectedRoom) room = selectedRoom;

  return async (dispatch) => {
    try {
      const response = await Api.get(`/container/${room.competitionRoomCode}`);

      if (response.code && response.result) {
        const containers = response.result;

        containers.forEach((container, idx) => {
          container.index = container.index || idx + 1;
          container.points = 0;
          if (container.mockRoundData && container.mockRoundData.length) {
            container.mockRoundData.forEach((round) => {
              if (round?.Round?.isLive) {
                container.points += parseFloat(
                  (
                    (1.0 * round.roundScore * round?.Round?.roundWeightage) /
                    100.0
                  ).toFixed(3)
                );
              }
            });
          }
          if (container.roundData && container.roundData.length) {
            container.roundScores = {};
            container.roundData.forEach((round) => {
              if (round.roundScore && round.roundScore.length) {
                container.points += parseFloat(
                  weightedScoreCalculator(
                    round.roundScore
                      .filter(({ submit }) => submit === true)
                      .map((r) => ({
                        ...r,
                        assessment: r.assessment.filter(
                          ({ points }) => points !== null
                        ),
                      }))
                      .filter((v) => v.assessment.length),
                    round.Round.roundWeightage
                  )
                );
              }
              if (round?.adjustedScore && round?.adjustedScore !== 0) {
                container.points += parseFloat(
                  (round?.adjustedScore * round?.Round?.roundWeightage) / 100
                );
              }
            });
          }
        });

        dispatch({
          type: GET_ALL_CONTAINERS,
          containers: containers,
        });
        if (initial && containers?.length) {
          dispatch(setContainerActive(containers[0]));
          dispatch(getQualifiedContainers());
        } else if (
          containerState?.current?.containerCode &&
          containers?.find(
            (c) => c.containerCode === containerState?.current?.containerCode
          )
        ) {
          dispatch(
            setContainerActive(
              containers?.find(
                (c) =>
                  c.containerCode === containerState?.current?.containerCode
              )
            )
          );
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

export const getQualifiedContainers = () => {
  const rooms = store.getState().rooms.all;
  const qualifiedRoom = rooms?.find((room) => room?.roomCode === "qualified");
  return async (dispatch) => {
    try {
      const response = await Api.get(
        `/container/${qualifiedRoom.competitionRoomCode}`
      );
      if (response.code && response.result) {
        const containers = response.result;
        containers.forEach((container, idx) => {
          container.index = container.index || idx + 1;
          container.points = 0;
          if (container.mockRoundData && container.mockRoundData.length) {
            container.mockRoundData.forEach((round) => {
              if (round?.Round?.isLive) {
                container.points += parseFloat(
                  (
                    (1.0 * round.roundScore * round?.Round?.roundWeightage) /
                    100.0
                  ).toFixed(3)
                );
              }
            });
          }
          if (container.roundData && container.roundData.length) {
            container.roundScores = {};
            container.roundData.forEach((round) => {
              if (round.roundScore && round.roundScore.length) {
                container.points += parseFloat(
                  weightedScoreCalculator(
                    round.roundScore
                      .filter(({ submit }) => submit === true)
                      .map((r) => ({
                        ...r,
                        assessment: r.assessment.filter(
                          ({ points }) => points !== null
                        ),
                      }))
                      .filter((v) => v.assessment.length),
                    round.Round.roundWeightage
                  )
                );
              }
            });
          }
        });
        dispatch({
          type: SET_QUALIFIED_CONTAINERS,
          containers: response.result,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const createContainer = (name) => {
  const room = store.getState().rooms.selected;
  const containers = store.getState().containers.all;
  const payload = {
    containerName: name,
    competitionCode: room.competitionCode,
    roomCode: room.roomCode,
    competitionRoomCode: room.competitionRoomCode,
    index: 1,
  };
  return async (dispatch) => {
    dispatch(pushRequest(1));
    try {
      const response = await Api.post("/container/createContainer", payload);
      if (response.code && response.result) {
        dispatch({
          type: CREATE_CONTAINER,
          containers: [response.result, ...containers],
        });
        dispatch({
          type: SET_CONTAINER_ACTIVE,
          container: response.result,
        });
        dispatch(
          notify({
            message: ` ${name} added successfully`,
            type: "success",
          })
        );
        dispatch(getQualifiedContainers());
        if (room && room.roomCode) {
          dispatch(getAllRooms(room.competitionCode));
          dispatch({
            type: SET_ROOM_SELECTED,
            room: { ...room, containersCount: 1 + (room.containersCount || 0) },
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
    dispatch(popRequest());
  };
};

export const updateContainerImage = (container) => {
  const room = store.getState().rooms.selected;
  const current = store.getState().containers.current;
  const data = {};
  if (container.imageURL) {
    data.imageURL = container.imageURL;
    data.emojiObject = null;
  }
  if (container.emojiObject) {
    data.imageURL = null;
    data.emojiObject = container.emojiObject;
  }
  return async (dispatch) => {
    try {
      const response = await Api.update(
        `/container/${current.containerCode}`,
        data
      );

      if (response.code && response.result) {
        dispatch(getQualifiedContainers());
        dispatch(getAllContainers(room));
        dispatch({
          type: SET_CONTAINER_ACTIVE,
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

export const updateContainer = (container, setToConfig = false) => {
  const competition = store.getState().competition.current;
  const room = store.getState().rooms.selected;
  const current = store.getState().containers.current;
  // if (
  //   container.containerName &&
  //   current.containerName === container.containerName
  // ) {
  //   return {
  //     type: SET_CONTAINER_ACTIVE,
  //     container: current,
  //   };
  // }
  const data = {};
  if (!container.containerCode) container.containerCode = current.containerCode;
  if (container.roomCode) data.roomCode = container.roomCode;
  if (container.users) data.users = container.users;
  if (container.containerName) data.containerName = container.containerName;
  // if (container.addUser) data.addUser = container.addUser;
  if (container.makeAdmin) data.makeAdmin = container.makeAdmin;
  if (container.imageURL) {
    data.imageURL = container.imageURL;
    data.emojiObject = null;
  }
  if (container.emojiObject) {
    data.imageURL = null;
    data.emojiObject = container.emojiObject;
  }
  if ("isDeleted" in container) {
    data.isDeleted = container.isDeleted;
  }
  if ("lockRegistration" in container) {
    data.lockRegistration = container.lockRegistration;
  }

  return async (dispatch) => {
    try {
      const response = await Api.update(
        `/container/${container.containerCode}`,
        data
      );

      if (response.code && response.result) {
        if (setToConfig) {
          dispatch({
            type: GET_CONTAINER,
            container: response.result,
          });
        } else {
          await dispatch(getAllContainers(room));
          if (container.isDeleted) {
            dispatch({
              type: SET_CONTAINER_ACTIVE,
              container: store.getState().containers.all[0] || {},
            });
          }
          dispatch(getQualifiedContainers());
          if (
            container.containerCode ===
            store.getState().containers.current?.containerCode
          ) {
            dispatch({
              type: SET_CONTAINER_ACTIVE,
              container: response.result,
            });
          }
        }
        if (container.roomCode) {
          dispatch(getAllRooms(competition.competitionCode));
          if (room && room.roomCode !== container.roomCode) {
            dispatch({
              type: SET_ROOM_SELECTED,
              room: { ...room, containersCount: room.containersCount - 1 },
            });
          }
        }
        if (data.isDeleted) {
          dispatch(
            notify({
              message: ` ${response.result.containerName} removed successfully`,
              type: "success",
            })
          );
        } else if (data.users && data?.users?.length && data.users[0].email) {
          dispatch(
            notify({
              message: ` ${data.users[0].email} invited successfully`,
              type: "success",
            })
          );
        }
        dispatch(getQualifiedContainers());
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch({
        type: SET_CONTAINER_ACTIVE,
        container: current,
      });
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const selectOrUnselectContainer = (containerSelected, clear = false) => {
  const container = store.getState().containers;
  const selected = container.all.map((container) => {
    // for bulk deselection
    if (clear) {
      container.isSelected = false;
    } else {
      if (container._id === containerSelected._id) {
        // select the unselected container and vice versa
        container.isSelected = !container.isSelected;
      }
    }
    return container;
  });
  return {
    type: SET_CONTAINER_SELECTED_OR_UNSELECTED,
    selected,
  };
};

export const setContainerActive = (container) => {
  return {
    type: SET_CONTAINER_ACTIVE,
    container: container,
  };
};

export const deleteContainerBulk = (selectedContiners = []) => {
  const containers = store.getState().containers.all;
  const room = store.getState().rooms.selected;
  const data = {};
  if (!selectedContiners?.length) {
    data.containerCodes = containers.map((container) => {
      if (container.isSelected) {
        return container.containerCode;
      }
    });
  } else {
    data.containerCodes = selectedContiners;
  }
  data.competitionCode = store.getState().competition.current.competitionCode;
  data.isDeleted = true;
  console.log(data);

  return async (dispatch) => {
    try {
      const response = await Api.update(
        "/container/bulkUpdateContainers",
        data
      );
      if (response.code && response.result) {
        await dispatch(getAllContainers(room));
        await dispatch(getAllRooms(data.competitionCode));
        dispatch(
          notify({
            type: "success",
            message: "Removed successfully!",
          })
        );
        await dispatch(getQualifiedContainers());
        const conts = store.getState().containers.all;
        if (conts.length > 0) {
          dispatch(setContainerActive(conts[0]));
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

export const updateContainerBulk = (
  roomCode,
  moveUnselected = false,
  selectedContiners = []
) => {
  const competition = store.getState().competition.current;
  const allRooms = store.getState().rooms.all;
  const containers = store.getState().containers.all;
  const room = store.getState().rooms.selected;
  const sendingRoom = allRooms.find((r) => r.roomCode === roomCode);
  const data = {};
  data.competitionCode = competition.competitionCode;
  if (roomCode) data.roomCode = roomCode;
  if (!selectedContiners?.length) {
    if (moveUnselected) {
      data.containerCodes = containers.map((container) => {
        if (!container.isSelected) {
          return container.containerCode;
        }
      });
    } else {
      data.containerCodes = containers.map((container) => {
        if (container.isSelected) {
          return container.containerCode;
        }
      });
    }
  } else {
    data.containerCodes = selectedContiners;
  }

  return async (dispatch) => {
    // if (room.roomCode === roomCode) {
    //   dispatch(
    //     notify({ type: "error", message: `You are already in ${roomCode}` })
    //   );
    // } else {
    try {
      const response = await Api.update(
        "/container/bulkUpdateContainers",
        data
      );
      if (response.code && response.result) {
        // dispatch(setRoomSelected(sendingRoom));
        // dispatch(getAllRooms(competition.competitionCode));
        dispatch(getAllRooms(competition.competitionCode));
        await dispatch(getAllContainers(room));
        const containers = store.getState().containers.all;
        dispatch({
          type: SET_CONTAINER_ACTIVE,
          container: containers[0],
        });
        dispatch(getQualifiedContainers());
        // dispatch({
        //   type: SET_ROOM_SELECTED,
        //   room: {
        //     ...sendingRoom,
        //     containersCount:
        //       (sendingRoom.containersCount || 0) + data.containerCodes.length,
        //   },
        // });
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
    // }
  };
};

export const removeUserFromContainer = (
  containerCode,
  email,
  isInviting = false
) => {
  const room = store.getState().rooms.selected;

  return async (dispatch) => {
    try {
      const payload = {
        containerCode,
        email,
      };
      const response = await Api.post(
        `/container/remove-invited-user`,
        payload
      );
      if (response.code && response.result) {
        if (isInviting) {
          dispatch({
            type: GET_CONTAINER,
            container: response.result,
          });
        } else {
          dispatch(getAllContainers(room));
          dispatch(getQualifiedContainers());
          dispatch(setContainerActive(response.result));
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

export const makeUserAdminFromContainer = (containerCode, email) => {
  const room = store.getState().rooms.selected;

  return async (dispatch) => {
    try {
      const payload = {
        containerCode,
        email,
      };
      const response = await Api.post(`/container/make-user-admin`, payload);
      if (response.code && response.result) {
        dispatch(getAllContainers(room));
        dispatch(setContainerActive(response.result));
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

export const crudMemberContainer = (container, user, crud) => {
  const containers = store.getState().containers.all;
  const selected = containers.map((_container) => {
    if (_container._id === container._id) {
      if (crud === "ADD") {
        _container.users.push(user);
      } else {
        _container.users = _container.users.filter(
          (_user) => _user.email !== user.email
        );
      }
    }
    return container;
  });

  return {
    type: CRUD_MEMBER_CONTAINER,
    selected,
  };
};

export const containersDragAndDrop = (containers) => {
  const room = store.getState().rooms.selected;

  return async (dispatch) => {
    try {
      const response = await Api.post(
        `/container/rearrangeContainers/${room.competitionRoomCode}`,
        {
          containers,
        }
      );
      if (response.code && response.result) {
        dispatch({
          type: DRAG_AND_DROP_CONTAINERS,
          containers: containers,
        });
      } else {
        dispatch(
          notify({
            message: "There was an error saving container order",
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
};

export const rearrangeContainers = (
  containers,
  nameOrder = null,
  pointsOrder = null
) => {
  const sortType = {
    ASCENDING: "ASCENDING",
    DESCENDING: "DESCENDING",
  };

  const competitionState = store.getState().competition;

  const room = store.getState().rooms.selected;
  const payload = {
    containers,
  };
  if (pointsOrder) payload.pointsOrder = pointsOrder;
  if (nameOrder) payload.nameOrder = nameOrder;

  let participantsOrTeams = "participants";
  if (competitionState?.current?.competitionType === "TEAM")
    participantsOrTeams = "teams";

  return async (dispatch) => {
    try {
      const response = await Api.post(
        `/container/shuffleContainers/${room.competitionRoomCode}`,
        payload
      );
      if (response.code && response.result) {
        dispatch({
          type: REARRANGE_CONTAINERS,
          containers: response?.result,
        });
        if (nameOrder === sortType.ASCENDING)
          dispatch(
            notify({
              type: "success",
              message: `Sorted ${participantsOrTeams} in ascending order`,
            })
          );
        else if (nameOrder === sortType.DESCENDING)
          dispatch(
            notify({
              type: "success",
              message: `Sorted ${participantsOrTeams} in descending order`,
            })
          );
        else if (pointsOrder === sortType.ASCENDING)
          dispatch(
            notify({
              type: "success",
              message: `Sorted ${participantsOrTeams} in lowest to highest points order`,
            })
          );
        else if (pointsOrder === sortType.DESCENDING)
          dispatch(
            notify({
              type: "success",
              message: `Sorted ${participantsOrTeams} in highest to lowest points order`,
            })
          );
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

export const verifyUserInContainer = (containerCode, user) => {
  const data = {
    containerCode,
    users: user,
  };

  return async (dispatch) => {
    try {
      const response = await Api.post(`/container/verify-container-user`, data);
      if (response.code && response.result) {
        dispatch({
          type: GET_CONTAINER,
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

// export const bulkCreateContainers = (containers) => {
//   const oldContainers = store.getState().containers.all;
//   const room = store.getState().rooms.selected;
//   containers = containers.filter(
//     (container) =>
//       !oldContainers.find((c) => c.containerName === container.containerName)
//   );

//   const oldContainerNames = oldContainers.map((c) => c.containerName);

//   const totalContainers = containers.length;
//   containers = [...new Set(containers)];

//   containers = containers.filter(function (c) {
//     return oldContainerNames.indexOf(c) == -1;
//   });

//   return async (dispatch) => {
//     try {
//       const allSettled = await Promise.all(
//         containers.map(async (container) => {
//           const payload = {
//             containerName: container,
//             competitionCode: room.competitionCode,
//             roomCode: room.roomCode,
//             competitionRoomCode: room.competitionRoomCode,
//             index: 1,
//           };
//           const response = await Api.post(
//             "/container/createContainer",
//             payload
//           );
//           if (response.code && response.result) {
//             return response.result;
//           } else {
//             throw new Error(response.message);
//           }
//         })
//       );

//       let message = "";
//       if (totalContainers - allSettled.length > 0) {
//         message = `${
//           totalContainers - allSettled.length
//         } Duplicates were found and skipped. `;
//       }
//       message += `${allSettled.length} Codes added to the ${room.roomName} List.`;

//       // if (allSettled.length === containers.length) {
//       dispatch(getAllContainers(room));
//       dispatch(getQualifiedContainers());
//       dispatch(getAllRooms(room.competitionCode));
//       dispatch({
//         type: SET_ROOM_SELECTED,
//         room: {
//           ...room,
//           containersCount: containers.length + (room.containersCount || 0),
//         },
//       });
//       dispatch(
//         notify({
//           message,
//           type: "success",
//         })
//       );
//       // } else {
//       //   throw new Error("Failed to create some containers");
//       // }
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

export const bulkCreateContainers = (containers, roomCode) => {
  const room = store.getState().rooms.selected;
  const { segment } = store.getState().misc;

  return async (dispatch) => {
    dispatch(activateUploadRequest(containers.length));
    try {
      const payload = {
        containers,
        competitionCode: room.competitionCode,
        roomCode: roomCode || room.roomCode,
        competitionRoomCode: room.competitionRoomCode,
      };
      const response = await Api.post(
        "/container/bulkCreateContainers",
        payload
      );
      if (response.code && response.result) {
        const analytics = new SegmentHandler(segment);
        analytics.trackUserEvent(
          SegmentHandler.EVENTS.BULK_UPLOAD,
          response.result
        );
        // dispatch(
        //   notify({
        //     message: response.message,
        //     type: "success",
        //   })
        // );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(uploadExceptionOccured());
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const clearContainers = () => {
  return {
    type: CLEAR_CONTAINERS,
  };
};

export const setSelectionOfContainers = () => {
  const selection = store.getState().containers.selection;
  return {
    type: SET_SELECTION_FOR_CONTAINERS,
    selection: !selection,
  };
};

export const selectContainers = (containers) => {
  return {
    type: SELECT_CONTAINERS,
    containers,
  };
};

export const unselectContainers = () => {
  const allContainers = store.getState().containers.all;
  allContainers.forEach((container) => (container.isSelected = false));
  return {
    type: UNSELECT_CONTAINERS,
    containers: allContainers,
  };
};

export const getSingleContainer = (containerCode) => {
  return async (dispatch) => {
    try {
      const response = await Api.get(
        `/container/get-single-container/${containerCode}`
      );
      if (response.code && response.result) {
        dispatch({
          type: GET_CONTAINER,
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

export const setContainerList = (containers) => {
  return {
    type: GET_ALL_CONTAINERS,
    containers,
  };
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
