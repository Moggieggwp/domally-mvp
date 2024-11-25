import { IAction, IUserPropertiesState } from 'src/types/redux';
import { GET_PROPERTIES, GET_PROPERTIES_ERROR, GET_PROPERTIES_SUCCESS, RESET_PROPERTIES, SET_PROPERTY_FIlTER } from './../actionTypes';

const defaultAppState: IUserPropertiesState = {
  loading: false,
  error: null,
  properties: undefined,
  propertiesFilter: null,
  likedProperties: [],
};

export default function usersProperties(state = defaultAppState, action: IAction<any>): IUserPropertiesState {
  switch (action.type) {
    case GET_PROPERTIES:
      return {
        ...state,
        loading: true,
      };
    case GET_PROPERTIES_SUCCESS:
      return {
        ...state,
        properties: action.payload,
        loading: false,
      };
    case RESET_PROPERTIES:
      return {
        ...state,
        properties: null,
        propertiesFilter: null,
      };
    case GET_PROPERTIES_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SET_PROPERTY_FIlTER: {
      return {
        ...state,
        propertiesFilter: action.payload,
      };
    }
    default:
      return state;
  }
}
