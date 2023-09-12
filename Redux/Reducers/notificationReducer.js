import { NOTIFY } from "../actionTypes";

const INITIAL_STATE = {
  message: "",
  type: "",
  code: "",
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFY:
      return {
        ...state,
        message: action.message,
        type: action.notificationType,
        code: action.code,
      };
    default:
      return state;
  }
};

export default reducer;
