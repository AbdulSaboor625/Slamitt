import { ROUND_CATEGORY } from "../actionTypes";

const INITIAL_STATE = {
  roundCategory: "all"
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ROUND_CATEGORY:
      return {
        roundCategory: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
