import { SET_LEADERBOARD_CONTAINERS } from "../actionTypes";

const INITIAL_STATE = {
  leaderboardContainers: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case SET_LEADERBOARD_CONTAINERS:
      return {
        ...state,
        leaderboardContainers: action.containers,
      };
    default:
      return state;
  }
};

export default reducer;
