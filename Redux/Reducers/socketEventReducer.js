import { EVENT_ROUND_CONTAINERS_UPDATE, CLEAR_EVENT } from "../actionTypes";

const INITIAL_STATE = {
  event: {},
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EVENT_ROUND_CONTAINERS_UPDATE:
      return {
        ...state,
        event: action.type,
      };
    case CLEAR_EVENT:
      return {
        ...state,
        event: {},
      };
    default:
      return state;
  }
};

export default reducer;
