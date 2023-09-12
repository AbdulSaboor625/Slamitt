import { OPEN_MODAL , CLOSE_MODAL } from "../actionTypes";

export const openModal = () => {
  return async (dispatch) => {

    dispatch({
          type: OPEN_MODAL,
          payload: true,
        });
  }
};
export const closeModal = () => {
  return async (dispatch) => {
    dispatch({
          type: CLOSE_MODAL,
          payload: false,
        });
  }
};