import { OPEN_MODAL , CLOSE_MODAL } from "../actionTypes";
const INITIAL_STATE = {
  open: false,
};
const reducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case OPEN_MODAL:
      return {
        loader: action.payload,
      };
    case CLOSE_MODAL:
      return {
        loader: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
