import {
  ADD_JUDGE_TOKEN,
  ADD_TOKEN,
  LOGOUT,
  LOGOUT_JUDGE,
  UPDATE_USER,
} from "../actionTypes";

const INITIAL_STATE = {
  judgeToken: "",
  slamittToken: "",
  user: "",
  loginTime: null,
};
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_JUDGE_TOKEN:
      return {
        ...state,
        judgeToken: action.judgeToken,
      };
    case ADD_TOKEN:
      return {
        ...state,
        slamittToken: action.slamittToken,
        user: action.user,
        loginTime: new Date(),
      };
    case UPDATE_USER:
      return {
        ...state,
        user: action.user,
      };
    case LOGOUT:
      return { ...state, slamittToken: "", user: "", loginTime: null };
    case LOGOUT_JUDGE:
      return { ...state, judgeToken: "" };
    default:
      return state;
  }
};

export default reducer;
