import { SET_CONTAINERS_LIST, SET_REGISTRATIONS_LIST } from "../actionTypes";

const INITIAL_STATE = {
  containersList: [],
  registrationsList: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CONTAINERS_LIST:
      return {
        ...state,
        containersList: action.containers,
      };
    case SET_REGISTRATIONS_LIST:
      return {
        ...state,
        registrationsList: action.containers,
      };
    default:
      return state;
  }
};

export default reducer;
