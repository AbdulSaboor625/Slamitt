import SegmentHandler from "../../analytics/segment";
import Api from "../../services";
import { routeGenerator, routes } from "../../utility/config";
import { OTP_MODULE } from "../../utility/constants";
import { ADD_TOKEN, LOGOUT, LOGOUT_JUDGE, UPDATE_USER } from "../actionTypes";
import { store } from "../store";
import { notify } from "./notificationActions";
import { changePage } from "./pageHandlerActions";

export const login = (payload) => {
  return async (dispatch, getState) => {
    const { segment } = getState().misc;
    const analytics = new SegmentHandler(segment);
    try {
      const response = await Api.post("/user/login", payload);
      if (response.code && response.result.user) {
        analytics.trackUserEvent(
          SegmentHandler.EVENTS.SIGN_IN,
          response.result.user
        );
        dispatch({
          type: ADD_TOKEN,
          slamittToken: response.result.token,
          user: response.result.user,
        });
        if (response.result.user.is_verified) {
          if (payload.redirectRoute) {
            window.location.href = payload.redirectRoute;
          } else if (response.result.user.step === "DASHBOARD")
            window.location.href = routes.dashboard;
          else if (response.result.user.step === "DETAILS_MODULE")
            window.location.href = routes.addDetails;
          else if (!response.result.user?.step)
            window.location.href = routes.dashboard;
        } else {
          throw new Error(response.message);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const signUpParticipant = (payload) => {
  return async (dispatch) => {
    try {
      const response = await Api.post("/user/create-user-participant", payload);
      if (response.code && response.result.user) {
        dispatch({
          type: ADD_TOKEN,
          slamittToken: response.result.token,
          user: response.result.user,
        });

        if (payload.redirectRoute) {
          window.location.href = payload.redirectRoute;
        } else {
          window.location.href = routes.dashboard;
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const logoutJudge = () => {
  return {
    type: LOGOUT_JUDGE,
  };
};

export const addToken = (payload) => {
  return {
    type: ADD_TOKEN,
    slamittToken: payload.slamittToken,
    user: payload.user,
  };
};

export const updateUser = (payload) => {
  return {
    type: UPDATE_USER,
    user: payload.user,
  };
};

export const updateUserDetails = (payload) => {
  const { user } = store.getState().auth;

  return async (dispatch) => {
    try {
      const response = await Api.update(
        `/user/update-user/${user.userCode}`,
        payload
      );
      if (response.code && response.result) {
        dispatch({
          type: UPDATE_USER,
          user: response.result,
        });
        dispatch(
          notify({
            type: "success",
            message: "User details updated successfully",
          })
        );
      } else throw new Error(response.message);
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const invitedUserLoginOrRegister = (payload, makeAdmin) => {
  const { competition, containers } = store.getState();
  return async (dispatch) => {
    try {
      const response = await Api.post("/user/create-user-invited", payload);
      if (response.code && response.result.token) {
        // response.result.user.wasRegistered = true;
        if (!response.result.user.is_verified) {
          dispatch(changePage({ page: OTP_MODULE }));
          return;
        }
        dispatch({
          type: ADD_TOKEN,
          slamittToken: response.result.token,
          user: response.result.user,
        });
        window.location.replace(
          routeGenerator(routes.inviteGetStarted, {
            competitionCode: competition.current.competitionCode,
            containerCode: containers.current.containerCode,
            makeAdmin,
          })
        );
      } else {
        if (response.result) dispatch(changePage({ page: OTP_MODULE }));
        else throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const crewLoginOrRegister = (payload) => {
  const { competition } = store.getState();
  return async (dispatch) => {
    try {
      const response = await Api.post("/user/create-user-invited", payload);
      if (response.code && response.result.token) {
        // response.result.user.wasRegistered = true;
        dispatch({
          type: ADD_TOKEN,
          slamittToken: response.result.token,
          user: response.result.user,
        });
        window.location.replace(
          routeGenerator(routes.crewGetStarted, {
            competitionCode: competition.current.competitionCode,
          })
        );
      } else {
        if (response.result) dispatch(changePage({ page: OTP_MODULE }));
        else throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};

export const refreshToken = () => {
  return async (dispatch) => {
    try {
      const response = await Api.get("/user/token/refresh-token");
      if (response.code && response.result.user) {
        dispatch({
          type: ADD_TOKEN,
          slamittToken: response.result.token,
          user: response.result.user,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };
};
