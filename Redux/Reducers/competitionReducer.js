import { competitionType, roundStatus } from "../../utility/config";
import {
  CREATE_OR_UPDATE_COMPETITION,
  CREATE_ROUND,
  GET_ALL_COMPETITIONS_ORGANIZED,
  GET_ALL_COMPETITIONS_PARTICIPATED,
  GET_ALL_ROUNDS,
  GET_CATEGORY_AND_SUB_CATEGORY,
  GET_SINGLE_ROUND,
  SET_COMPETITION_SELECTED,
  SET_ROUND_STATUS,
  SET_ROUND_SELECTED_PARTICIPATED,
  GET_ALL_ROUNDS_PARTICIPATED,
  CLEAR_COMPETITION_STATE,
  SELECT_ASSESSMENT_CRITERIA,
  REMOVE_ASSESSMENT_CRITERIA,
  CLEAR_ROUND,
  DRAG_AND_DROP_ROUNDS,
} from "../actionTypes";

const INITIAL_STATE = {
  create: {
    imageURL: "",
    competitionName: "",
    categoryName: "",
    subCategoryArray: [],
    competitionType: "",
    teamSize: 0,
    minTeamSize: 0,
  },
  participated: [],
  organized: [],
  current: null,
  categories: [],
  criteriaSelected: [],
  round: {
    details: null,
    status: roundStatus.DRAFT,
  },
  allRounds: [],
  competitionParticipated: {},
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_OR_UPDATE_COMPETITION:
      const obj = {};
      if (action.image) obj.image = action.image;
      if (action.competitionName || action.competitionName === "")
        obj.competitionName = action.competitionName;
      if (action.categoryName) obj.categoryName = action.categoryName;
      if (action.subCategoryArray)
        obj.subCategoryArray = action.subCategoryArray;
      if (action.competitionType) obj.competitionType = action.competitionType;
      if (action.teamSize) obj.teamSize = action.teamSize;
      if (action.minTeamSize) obj.minTeamSize = action.minTeamSize;
      return {
        ...state,
        create: {
          ...state.create,
          ...obj,
        },
      };
    case GET_CATEGORY_AND_SUB_CATEGORY:
      return {
        ...state,
        categories: action.categories,
        subCategories: action.subCategories,
      };
    case SET_ROUND_STATUS:
      return {
        ...state,
        round: {
          ...state.round,
          status: action.status,
        },
      };
    case SET_COMPETITION_SELECTED:
      return {
        ...state,
        current: action.competition,
      };
    case GET_ALL_COMPETITIONS_PARTICIPATED:
      return {
        ...state,
        participated: action.competitions,
      };
    case GET_ALL_COMPETITIONS_ORGANIZED:
      return {
        ...state,
        organized: action.competitions,
      };
    case GET_ALL_ROUNDS:
      if (action.round && action.round.details)
        return {
          ...state,
          round: action.round,
          allRounds: action.rounds,
        };
      else
        return {
          ...state,
          allRounds: action.rounds,
        };
    case CREATE_ROUND:
      return {
        ...state,
        round: {
          details: action.round,
          status: roundStatus.DRAFT,
        },
      };
    case GET_SINGLE_ROUND:
      return {
        ...state,
        round: {
          details: action.round,
          status: action.round.isLive ? roundStatus.LIVE : roundStatus.DRAFT,
        },
      };
    case GET_ALL_ROUNDS_PARTICIPATED:
      return {
        ...state,
        allRounds: action.competition.roundData,
      };
    case SET_ROUND_SELECTED_PARTICIPATED:
      return {
        ...state,
        round: {
          details: action.round,
        },
      };
    case CLEAR_COMPETITION_STATE:
      return {
        ...state,
        create: {
          imageURL: "",
          competitionName: "",
          categoryName: "",
          subCategoryArray: [],
          competitionType: "",
          teamSize: 0,
          minTeamSize: 0,
        },
        current: null,
        categories: [],
        subCategories: [],
        round: {
          details: null,
          status: roundStatus.DRAFT,
        },
        allRounds: [],
        competitionParticipated: {},
      };
    case SELECT_ASSESSMENT_CRITERIA:
      return {
        ...state,
        criteriaSelected: action.criteria,
      };
    case REMOVE_ASSESSMENT_CRITERIA:
      return {
        ...state,
        criteriaSelected: action.criteria,
      };
    case CLEAR_ROUND:
      return {
        ...state,
        round: {
          details: null,
          status: roundStatus.DRAFT,
        },
      };
    case DRAG_AND_DROP_ROUNDS:
      return {
        ...state,
        allRounds: action.rounds,
      };
    default:
      return state;
  }
};

export default reducer;
