import {
  ACTIVATE_UPLOAD_REQUEST,
  CLEAR_PERSIST_CONFIG,
  DEACTIVATE_UPLOAD_REQUEST,
  PERSIST_COMPETITION,
  POP_REQUEST,
  PUSH_REQUEST,
  SET_EXCEPTION_OCCURED,
} from "../actionTypes";
import { store } from "../store";

export const pushRequest = () => {
  const spinner = [...store.getState().config.spinner];
  spinner.push(1);
  return {
    type: PUSH_REQUEST,
    request: spinner,
  };
};

export const popRequest = () => {
  const spinner = [...store.getState().config.spinner];
  spinner.pop();

  return {
    type: POP_REQUEST,
    request: spinner,
  };
};

export const persitCompetition = ({
  competitionCode,
  organized = true,
  createdBy,
  email,
}) => {
  return {
    type: PERSIST_COMPETITION,
    competitionCode,
    organized,
    createdBy,
    email,
  };
};

export const clearPersistConfig = () => {
  return {
    type: CLEAR_PERSIST_CONFIG,
  };
};

export const activateUploadRequest = () => {
  return {
    type: ACTIVATE_UPLOAD_REQUEST,
  };
};
export const deactivateUploadRequest = () => {
  return {
    type: DEACTIVATE_UPLOAD_REQUEST,
  };
};
export const uploadExceptionOccured = () => {
  return {
    type: SET_EXCEPTION_OCCURED,
  };
};
