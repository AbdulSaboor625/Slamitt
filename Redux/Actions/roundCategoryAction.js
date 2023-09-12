import { ROUND_CATEGORY } from "../actionTypes";

export const changeRoundCategory = (value) => {
  return async (dispatch) => {

    dispatch({
          type: ROUND_CATEGORY,
          payload: value,
        });
  }
};