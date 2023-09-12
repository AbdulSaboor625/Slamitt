import Api from "../../services";
import {
  CREATE_ROOM,
  DELETE_ROOM,
  GET_ALL_ROOMS,
  SET_ROOM_SELECTED,
  UPDATE_ROOM,
} from "../actionTypes";
import { store } from "../store";
import { notify } from "./notificationActions";

export const getAllRooms = (competitionCode) => {
  return async (dispatch) => {
    try {
      const response = await Api.get(`/room/${competitionCode}`);
      if (response.code && response.result) {
        
        dispatch({
          type: GET_ALL_ROOMS,
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

export const createRoom = (name) => {
  const competition = store.getState().competition;
  const payload = {
    competitionCode: competition.current.competitionCode,
    roomName: name,
    isCustom: true,
  };
  return async (dispatch) => {
    try {
      const response = await Api.post("/room/createRoom", payload);
      if (response.code && response.result) {
        dispatch({
          type: CREATE_ROOM,
          room: response.result,
        });
        dispatch({
          type: SET_ROOM_SELECTED,
          room: response.result,
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

export const setRoomSelected = (room) => {
  return {
    type: SET_ROOM_SELECTED,
    room,
  };
};

export const updateRoom = (payload) => {
  const competitionRoomCode = payload.competitionRoomCode;
  const data = {};
  if (payload.hasOwnProperty("isCustom")) data.isCustom = payload.isCustom;
  if (payload.roomName) data.roomName = payload.roomName;

  return async (dispatch) => {
    try {
      const response = await Api.update(`/room/${competitionRoomCode}`, data);
      if (response.code && response.result) {
        dispatch({
          type: UPDATE_ROOM,
          room: response.result,
        });
        dispatch({
          type: SET_ROOM_SELECTED,
          room: response.result,
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

export const deleteRoom = (payload) => {
  const competitionRoomCode = payload.competitionRoomCode;
  const data = { isDeleted: true };
  return async (dispatch) => {
    try {
      const response = await Api.post(
        `/room/delete/${competitionRoomCode}`,
        data
      );
      if (response.code && response.result) {
        dispatch({
          type: DELETE_ROOM,
          room: response.result[0],
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
