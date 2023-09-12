import {
  SET_CONTAINER_SELECTED_CHAT,
  GET_CHAT,
  ADD_GROUP_CHAT,
  ADD_ORGANISER_CHAT,
  SET_ROOM_SELECTED_CHAT,
  GET_ALL_ROOMS_CHAT,
  GET_ALL_CONTAINERS_CHAT,
  JOIN_ROOM,
} from "../actionTypes";

const INITIAL_STATE = {
  role: "",
  token: "",
  room: {},
  rooms: [],
  containers: [],
  container: {},
  chat: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_ROOMS_CHAT:
      return {
        ...state,
        rooms: action.rooms,
      };
    case GET_ALL_CONTAINERS_CHAT:
      return {
        ...state,
        containers: action.containers,
      };

    case SET_CONTAINER_SELECTED_CHAT:
      return {
        ...state,
        chat: [],
        container: action.container,
      };
    case SET_ROOM_SELECTED_CHAT:
      return {
        ...state,
        room: action.room,
      };

    case GET_CHAT:
      return {
        ...state,
        chat: action.chat,
      };
    case JOIN_ROOM:
      return {
        ...state,
        role: action.role,
        token: action.token,
      };
    case ADD_GROUP_CHAT:
    case ADD_ORGANISER_CHAT:

    default:
      return state;
  }
};

export default reducer;
