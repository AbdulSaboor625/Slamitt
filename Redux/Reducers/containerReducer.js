import {
  CLEAR_CONTAINERS,
  CREATE_CONTAINER,
  CRUD_MEMBER_CONTAINER,
  DRAG_AND_DROP_CONTAINERS,
  GET_ALL_CONTAINERS,
  GET_CONTAINER,
  REARRANGE_CONTAINERS,
  SELECT_CONTAINERS,
  SET_CONTAINER_ACTIVE,
  SET_CONTAINER_SELECTED_OR_UNSELECTED,
  SET_QUALIFIED_CONTAINERS,
  SET_SELECTION_FOR_CONTAINERS,
  UNSELECT_CONTAINERS,
  SET_CONTAINERS_LIST,
} from "../actionTypes";

const INITIAL_STATE = {
  all: [],
  current: null,
  selection: false,
  qualified: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_CONTAINERS:
      return {
        ...state,
        all: action.containers,
      };
    case SET_CONTAINER_SELECTED_OR_UNSELECTED:
      return {
        ...state,
        all: action.selected,
      };
    case SET_CONTAINER_ACTIVE:
      return {
        ...state,
        current: action.container,
      };
    case CREATE_CONTAINER:
      return {
        ...state,
        all: action.containers,
      };
    case CRUD_MEMBER_CONTAINER:
      return {
        ...state,
        selected: action.selected,
      };
    case DRAG_AND_DROP_CONTAINERS:
      return {
        ...state,
        all: action.containers,
      };
    case CRUD_MEMBER_CONTAINER:
      return {
        ...state,
        selected: action.selected,
      };
    case REARRANGE_CONTAINERS:
      return {
        ...state,
        all: action.containers,
      };
    case CLEAR_CONTAINERS:
      return {
        all: [],
        current: null,
      };
    case SET_SELECTION_FOR_CONTAINERS:
      return {
        ...state,
        selection: action.selection,
      };
    case GET_CONTAINER:
      return {
        ...state,
        current: action.container,
      };
    case SELECT_CONTAINERS:
      return {
        ...state,
        all: action.containers,
      };
    case UNSELECT_CONTAINERS:
      return {
        ...state,
        all: action.containers,
      };
    case SET_QUALIFIED_CONTAINERS:
      return {
        ...state,
        qualified: action.containers,
      };
    case SET_CONTAINERS_LIST:
      return {
        ...state,
        containersList: action.containers,
      };
    default:
      return state;
  }
};

export default reducer;
