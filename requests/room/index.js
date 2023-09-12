import Api from "../../services";
import { SOMETHING_WENT_WRONG } from "../../utility/constants";

export const getRoom = async (competitionRoomCode) => {
  try {
    const response = await Api.get(`/room/code/${competitionRoomCode}`);
    if (response.code && response.result) {
      const room = response.result;

      return room;
    }

    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const getAllRooms = async (competitionCode) => {
  try {
    const response = await Api.get(`/room/${competitionCode}`);
    if (response.code && response.result) {
      const rooms = response.result;

      return rooms;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const createRoom = async (newRoom) => {
  try {
    const response = await Api.post("/room/createRoom", newRoom);
    if (response.code && response.result) {
      const room = response.result;

      return room;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const updateRoom = async (competitionRoomCode, updateRoomBody) => {
  try {
    const response = await Api.update(
      `/room/${competitionRoomCode}`,
      updateRoomBody
    );
    if (response.code && response.result) {
      const room = response.result;

      return room;
    }
    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};
