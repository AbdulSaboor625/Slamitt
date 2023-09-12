import Api from "../../services";
import {
  CREATE_INSTITUTE,
  GET_INSTITUTES,
  GET_SUB_PROFESSION,
  INITIALIZE_ANALYTICS,
  SET_ACTIVE_SETTING_SECTION,
} from "../actionTypes";
import { notify } from "./notificationActions";

export const getSubProfession = (profession) => {
  return async (dispatch) => {
    try {
      const response = await Api.get(`/profession/${profession}`);
      if (response.code) {
        let list = response.result.subProfession;
        list = list.map((item) => {
          item.label = item.name;
          item.value = item._id;
          return item;
        });

        dispatch({
          type: GET_SUB_PROFESSION,
          payload: list,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };
};

export const getInstitutes = (subProfession) => {
  return async (dispatch) => {
    try {
      const response = await Api.get(`/institute/${subProfession}`);
      if (response.code && response.result) {
        dispatch({
          type: GET_INSTITUTES,
          payload: [response.result.institutes],
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };
};

export const createInstitute = (payload) => {
  return async (dispatch) => {
    try {
      const response = await Api.post(`/institute/addInstitute`, payload);
      if (response.code && response.result) {
        dispatch({
          type: CREATE_INSTITUTE,
          payload: response.result,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };
};

export const setSettingSectionActive = (active) => {
  return {
    type: SET_ACTIVE_SETTING_SECTION,
    active,
  };
};

export const initializeAnalytics = (payload) => {
  return {
    type: INITIALIZE_ANALYTICS,
    payload,
  };
};
