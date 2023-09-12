import {
  GET_ALL_ROUND_CONTAINERS,
  UPDATE_ROUND_CONTAINER,
  ADD_JUDGE_ROUND,
  GET_ROUND,
  UPDATE_JUDGE,
  CLEAR_JUDGE_STATE,
} from "../actionTypes";

const INITIAL_STATE = {
  judge: {},
  round: {},
  containers: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ROUND:
      return {
        ...state,
        round: action.round,
      };
    case ADD_JUDGE_ROUND:
      return {
        ...state,
        judge: action.judge,
        round: action.round ? action.round : state.round,
      };
    case GET_ALL_ROUND_CONTAINERS:
      return {
        ...state,
        containers: action.containers,
      };
    case UPDATE_ROUND_CONTAINER:
      return {
        ...state,
        containers: action.containers,
      };
    case UPDATE_JUDGE:
      return {
        ...state,
        judge: action.judge,
      };
    case CLEAR_JUDGE_STATE:
      return {
        ...state,
        judge: {},
        containers: [],
      };
    default:
      return state;
  }
};

export default reducer;
