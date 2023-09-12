import Api from "../../services";
import { SOMETHING_WENT_WRONG } from "../../utility/constants";

export const getAllRounds = async (competitionCode) => {
  try {
    const response = await Api.get(`/round/${competitionCode}`);
    if (response.code && response.result) {
      const rounds = response.result;

      return rounds;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const getRound = async (competitionRoundCode) => {
  try {
    const response = await Api.get(`/round/code/${competitionRoundCode}`);
    if (response.code && response.result) {
      const round = response.result;
      return round;
    }

    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const addOrUpdateSubmissionSettings = async (
  competitionRoundCode,
  payload
) => {
  try {
    const response = await Api.post(
      `/round/${competitionRoundCode}/submission-update`,
      payload
    );
    if (response.code && response.result) {
      const submission = response.result;
      return submission;
    }
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};
