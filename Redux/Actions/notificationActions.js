import { NOTIFY } from "../actionTypes";

export const notify = (payload) => {
  return {
    type: NOTIFY,
    code: payload.code || "",
    message: payload.message,
    notificationType: payload.type,
  };
};
