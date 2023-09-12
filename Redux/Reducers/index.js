import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistCombineReducers } from "redux-persist";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import competitionReducer from "./competitionReducer";
import configReducer from "./configReducer";
import containerReducer from "./containerReducer";
import judgeReducer from "./judgeReducer";
import miscReducer from "./miscReducer";
import notificationReducer from "./notificationReducer";
import pageHandlerReducer from "./pageHandlerReducer";
import persistConfigReducer from "./persistConfigReducer";
import roomReducer from "./roomReducer";
import modalReducer from "./modalReducer";
import roundCategoryReducer from "./roundCategoryReducer";
import leaderboardReducer from "./leaderboardReducer";
import paginatedContainersReducer from "./paginatedContainers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "persistConfig"],
};

const rootReducer = persistCombineReducers(persistConfig, {
  auth: authReducer,
  pageHandler: pageHandlerReducer,
  notification: notificationReducer,
  competition: competitionReducer,
  rooms: roomReducer,
  containers: containerReducer,
  paginatedContainers: paginatedContainersReducer,
  config: configReducer,
  judge: judgeReducer,
  misc: miscReducer,
  chat: chatReducer,
  modal: modalReducer,
  roundCategory: roundCategoryReducer,
  persistConfig: persistConfigReducer,
  leaderboard: leaderboardReducer,
});

export default rootReducer;
