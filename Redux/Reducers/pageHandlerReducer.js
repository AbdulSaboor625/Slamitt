import {
  ADD_EMAIL,
  PREV_PAGE,
  CHANGE_PAGE,
  ADD_PASSWORD,
  SCROLL_HANDLE,
} from "../actionTypes";
import { EMAIL_MODULE } from "../../utility/constants";

const INITIAL_STATE = {
  email: "",
  password: "",
  page: EMAIL_MODULE,
  existingUser: false,
  prevPage: "",
  permanent: false,
  scrollState: "",
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_EMAIL:
      return {
        ...state,
        email: action.email,
        existingUser: action.existingUser,
      };
    case ADD_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    case CHANGE_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case PREV_PAGE:
      return {
        ...state,
        prevPage: action.page,
      };
    case SCROLL_HANDLE:
      return {
        ...state,
        scrollState: action.scroll,
      };
    default:
      return state;
  }
};

export default reducer;
