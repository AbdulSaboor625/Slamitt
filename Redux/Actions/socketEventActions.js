import { EVENT_ROUND_CONTAINERS_UPDATE, CLEAR_EVENT } from "../actionTypes";

export const eventRoundContainersUpdate = () => {
  return {
    type: EVENT_ROUND_CONTAINERS_UPDATE,
  };
};

export const clearEvent = () => {
  return {
    type: CLEAR_EVENT,
  };
};
