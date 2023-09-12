import { settings } from "../../utility/config";
import {
  CREATE_INSTITUTE,
  GET_INSTITUTES,
  GET_SUB_PROFESSION,
  INITIALIZE_ANALYTICS,
  SET_ACTIVE_SETTING_SECTION,
} from "../actionTypes";

const INITIAL_STATE = {
  subProfession: [],
  institutes: [],
  config: {
    active: settings.COMPETITION,
  },
  segment: null,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SUB_PROFESSION:
      return {
        ...state,
        subProfession: action.payload,
      };
    case GET_INSTITUTES:
      return {
        ...state,
        institutes: action.payload,
      };
    case CREATE_INSTITUTE:
      return {
        ...state,
        institutes: [...state.institutes, action.payload],
      };
    case SET_ACTIVE_SETTING_SECTION:
      return {
        ...state,
        config: {
          ...state.config,
          active: action.active,
        },
      };
    case INITIALIZE_ANALYTICS:
      return {
        ...state,
        segment: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
