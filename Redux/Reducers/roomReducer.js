import {
  CREATE_ROOM,
  GET_ALL_ROOMS,
  SET_ROOM_SELECTED,
  UPDATE_ROOM,
  DELETE_ROOM,
} from "../actionTypes";

const INITIAL_STATE = {
  all: [],
  selected: {},
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_ROOMS:
      if ((!state.selected || !state.selected.roomName) && action.rooms.length)
        return {
          ...state,
          all: action.rooms,
          selected: action.rooms[0],
        };
      return {
        ...state,
        all: action.rooms,
      };
    case CREATE_ROOM:
      return {
        ...state,
        all: [...state.all, action.room],
      };
    case SET_ROOM_SELECTED:
      return {
        ...state,
        selected: action.room,
      };
    case UPDATE_ROOM:
      const updatedRoomIndex = state.all.findIndex(
        (room) => room.competitionRoomCode === action.room.competitionRoomCode
      );
      state.all[updatedRoomIndex] = action.room;
      return { ...state };
    case DELETE_ROOM:
      state.all = state.all.filter(
        (room) => room.competitionRoomCode !== action.room.competitionRoomCode
      );
      return { ...state };
    default:
      return state;
  }
};

export default reducer;
