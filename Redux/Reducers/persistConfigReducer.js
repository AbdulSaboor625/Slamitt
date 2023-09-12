import { CLEAR_PERSIST_CONFIG, PERSIST_COMPETITION } from "../actionTypes";

const INITIAL_STATE = {
  competitionCode: "",
  organized: true,
  createdBy: "",
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PERSIST_COMPETITION:
      return {
        ...state,
        competitionCode: action.competitionCode,
        organized: action.organized,
        createdBy: action.createdBy,
        email: action.email,
      };
    case CLEAR_PERSIST_CONFIG:
      return {
        competitionCode: "",
        organized: true,
        createdBy: "",
        email: "",
      };
    default:
      return state;
  }
};

export default reducer;
