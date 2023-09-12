import {
  POP_REQUEST,
  PUSH_REQUEST,
  ACTIVATE_UPLOAD_REQUEST,
  DEACTIVATE_UPLOAD_REQUEST,
  SET_EXCEPTION_OCCURED,
  PUSH_UPLOAD_COMPLETED,
} from "../actionTypes";

const STATUS_RESPONSE = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXCEPTION: "exception",
});
/**
 * status : ENUM["ACTIVE","INACTIVE","EXCEPTION"]
 * uploaded :[]
 *
 */
const INITIAL_STATE = {
  spinner: [],
  status: STATUS_RESPONSE.INACTIVE,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PUSH_REQUEST:
      return {
        ...state,
        spinner: action.request,
      };
    case POP_REQUEST:
      return {
        ...state,
        spinner: action.request,
      };
    case ACTIVATE_UPLOAD_REQUEST:
      return {
        ...state,
        status: STATUS_RESPONSE.ACTIVE,
      };
    case DEACTIVATE_UPLOAD_REQUEST:
      return {
        ...state,
        status: STATUS_RESPONSE.INACTIVE,
      };
    case SET_EXCEPTION_OCCURED:
      return {
        ...state,
        status: STATUS_RESPONSE.EXCEPTION,
      };
    default:
      return state;
  }
};

export default reducer;
