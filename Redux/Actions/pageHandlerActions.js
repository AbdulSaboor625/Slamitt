import {
  ADD_EMAIL,
  ADD_PASSWORD,
  CHANGE_PAGE,
  PREV_PAGE,
  SCROLL_HANDLE,
} from "../actionTypes";

export const addEmail = (payload) => {
  return {
    type: ADD_EMAIL,
    email: payload.email,
    existingUser: payload.existingUser || false,
  };
};

export const ScrollHandle = (payload) => {
  return {
    type: SCROLL_HANDLE,
    scroll: payload,
  };
};

export const addPassword = (payload) => {
  return {
    type: ADD_PASSWORD,
    password: payload.password,
  };
};

export const changePage = (payload) => {
  return {
    type: CHANGE_PAGE,
    page: payload.page,
  };
};
export const setPrevPage = (payload) => {
  return {
    type: PREV_PAGE,
    page: payload.page,
  };
};
