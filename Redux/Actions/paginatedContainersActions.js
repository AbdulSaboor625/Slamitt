import { weightedScoreCalculator } from "../../utility/common";
import { SET_CONTAINERS_LIST, SET_REGISTRATIONS_LIST } from "../actionTypes";

export const setContainersList = (container) => {
  return async (dispatch) => {
    if (container && container.length) {
      const containers = container;
      containers.forEach((container, idx) => {
        container.index = container.index || idx + 1;
        container.points = 0;
        if (container.mockRoundData && container.mockRoundData.length) {
          container.mockRoundData.forEach((round) => {
            if (round?.Round?.isLive) {
              container.points += parseFloat(
                (
                  (1.0 * round.roundScore * round?.Round?.roundWeightage) /
                  100.0
                ).toFixed(3)
              );
            }
          });
        }
        if (container.roundData && container.roundData.length) {
          container.roundScores = {};
          container.roundData.forEach((round) => {
            if (round.roundScore && round.roundScore.length) {
              container.points += parseFloat(
                weightedScoreCalculator(
                  round.roundScore
                    .filter(({ submit }) => submit === true)
                    .map((r) => ({
                      ...r,
                      assessment: r.assessment.filter(
                        ({ points }) => points !== null
                      ),
                    }))
                    .filter((v) => v.assessment.length),
                  round.Round.roundWeightage
                )
              );
            }
          });
        }
      });
      dispatch({
        type: SET_CONTAINERS_LIST,
        containers,
      });
    }
  };
};

export const setRegistrationsList = (containers) => {
  return async (dispatch) => {
    if (containers) {
      dispatch({
        type: SET_REGISTRATIONS_LIST,
        containers,
      });
    }
  };
};
