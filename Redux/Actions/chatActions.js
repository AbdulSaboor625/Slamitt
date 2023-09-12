import Api from "../../services";
import {
  ADD_GROUP_CHAT,
  ADD_ORGANISER_CHAT,
  GET_ALL_CONTAINERS_CHAT,
  GET_ALL_ROOMS_CHAT,
  GET_CHAT,
  JOIN_ROOM,
  SET_COMPETITION_SELECTED,
  SET_CONTAINER_SELECTED_CHAT,
  SET_ROOM_SELECTED_CHAT,
} from "../actionTypes";
import { store } from "../store";
import { notify } from "./notificationActions";

export const getAllRoomsChat = (competitionCode) => {
  const roomState = store.getState().rooms;
  if (roomState && roomState.all && roomState.all.length) {
    return {
      type: GET_ALL_ROOMS_CHAT,
      rooms: roomState.all,
    };
  } else
    return async (dispatch) => {
      try {
        const response = await Api.get(`/room/${competitionCode}`);
        if (response.code && response.result) {
          dispatch({
            type: GET_ALL_ROOMS_CHAT,
            rooms: response.result,
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

export const getAllContainersChat = (selectedRoom) => {
  let room = store.getState().chat.room;
  if (!room && selectedRoom) room = selectedRoom;

  return async (dispatch) => {
    try {
      const response = await Api.get(`/container/${room?.competitionRoomCode}`);

      if (response.code && response.result) {
        dispatch({
          type: GET_ALL_CONTAINERS_CHAT,
          containers: response.result,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error);
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const setRoomSelectedChat = (room) => {
  return {
    type: SET_ROOM_SELECTED_CHAT,
    room,
  };
};

export const setContainerSelectedChat = (container, isGroupChat) => {
  const updateContainer = { ...container };
  if (isGroupChat) updateContainer.containerCode = null;
  else updateContainer.roomCode = null;
  return {
    type: SET_CONTAINER_SELECTED_CHAT,
    container: updateContainer,
  };
};

export const getChat = (payload) => {
  let container = store.getState().chat.container;
  if (!container && payload) container = payload;

  const { competitionCode, containerCode, roomCode } = container;
  const getBody = { competitionCode };
  if (roomCode) getBody.roomCode = roomCode;
  else if (containerCode) getBody.containerCode = containerCode;

  return async (dispatch) => {
    try {
      const response = await Api.post(`/chat/getChat`, getBody);

      if (response.code && response.result) {
        let chat = response.result;
        chat.reverse();
        dispatch({
          type: GET_CHAT,
          chat: chat,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error);
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const addOrganiserChat = (payload) => {
  const chatState = store.getState().chat;
  const { container, role } = chatState;
  const { competitionCode, containerCode } = container;

  const newChatBody = {
    competitionCode,
    containerCode,
    payload,
    role,
  };

  return async (dispatch) => {
    try {
      const response = await Api.post(`/chat/addOrganiserChat`, newChatBody);
      if (response.code && response.result) {
        dispatch({
          type: ADD_ORGANISER_CHAT,
          payload: payload,
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

export const addGroupChat = (payload) => {
  const chatState = store.getState().chat;
  const { container, role } = chatState;
  const { competitionCode, roomCode } = container;

  const newChatBody = {
    competitionCode,
    roomCode,
    payload,
    role,
  };

  return async (dispatch) => {
    try {
      const response = await Api.post(`/chat/addGroupChat`, newChatBody);

      if (response.code && response.result) {
        dispatch({
          type: ADD_GROUP_CHAT,
          payload: payload,
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

export const getChatToken = (role) => {
  const container = store.getState().chat.container;
  const { competitionCode, roomCode, containerCode } = container;
  const getTokenBody = {
    competitionCode,
    roomCode,
    containerCode,
    role,
  };

  return async (dispatch) => {
    try {
      const response = await Api.post(
        `/chat/joinOrCreateChatRoom`,
        getTokenBody
      );

      if (response.code && response.result) {
        dispatch({
          type: JOIN_ROOM,
          token: response.result,
          role: role,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error);
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };
};

export const getParticipantContainer = (competitionCode) => {
  return async (dispatch) => {
    try {
      const response = await Api.get(
        `/container/get-participant-container/${competitionCode}`
      );
      if (response.code && response.result) {
        const { roomCode, competitionCode } = response.result;
        dispatch({
          type: SET_ROOM_SELECTED_CHAT,
          room: { roomCode, competitionCode, roomName: roomCode },
        });

        dispatch({
          type: GET_ALL_CONTAINERS_CHAT,
          containers: [{ ...response.result, containerName: "Organiser" }],
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log("error", error);
      dispatch({
        type: SET_COMPETITION_SELECTED,
        competition: null,
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
