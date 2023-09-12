import { SET_LEADERBOARD_CONTAINERS } from "../actionTypes";

export const setLeaderboardContainers = (Containers) => {
  return (dispatch) => {
    dispatch({
      type: SET_LEADERBOARD_CONTAINERS,
      containers: Containers,
    });
  };
};