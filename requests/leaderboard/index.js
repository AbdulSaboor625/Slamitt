import Api from "../../services";
import { SOMETHING_WENT_WRONG } from "../../utility/constants";

export const getLeaderboards = async () => {
  try {
    const response = await Api.get("/leaderboards");
    if (response && response.result) {
      const leaderboards = response.result;
      return leaderboards;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (err) {
    return null;
  }
};

export const createLeaderboard = async (newLeaderboard) => {
  try {
    const response = await Api.post("/leaderboards", newLeaderboard);
    if (response.code && response.result) {
      const leaderboard = response.result;
      return leaderboard;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (err) {
    return null;
  }
};
