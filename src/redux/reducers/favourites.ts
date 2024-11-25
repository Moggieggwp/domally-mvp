import { IAction, IFavouritesState } from 'src/types/redux';
import {
  GET_FAVOURITE_PROPERTIES,
  GET_FAVOURITE_PROPERTIES_ERROR,
  GET_FAVOURITE_PROPERTIES_SUCCESS,
  LIKE_PROPERTY,
  LIKE_PROPERTY_ERROR,
  LIKE_PROPERTY_SUCCESS,
  UNLIKE_PROPERTY,
  UNLIKE_PROPERTY_ERROR,
  UNLIKE_PROPERTY_SUCCESS,
} from './../actionTypes';

const defaultAppState: IFavouritesState = {
  loading: false,
  error: null,
  favouriteProperties: [],
  unlikedFavourites: [],
};

export default function profile(state = defaultAppState, action: IAction<any>): IFavouritesState {
  switch (action.type) {
    case GET_FAVOURITE_PROPERTIES: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_FAVOURITE_PROPERTIES_SUCCESS: {
      return {
        ...state,
        favouriteProperties: action.payload,
        unlikedFavourites: [],
        loading: false,
      };
    }
    case UNLIKE_PROPERTY: {
      return {
        ...state,
        loading: true,
      };
    }
    case UNLIKE_PROPERTY_SUCCESS: {
      let unlikedFavourites = state.unlikedFavourites;
      if (!unlikedFavourites.includes(action.payload)) {
        unlikedFavourites = [...state.unlikedFavourites, action.payload];
      }
      return {
        ...state,
        loading: false,
        unlikedFavourites,
      };
    }
    case LIKE_PROPERTY: {
      return {
        ...state,
        loading: true,
      };
    }
    case LIKE_PROPERTY_SUCCESS: {
      let unlikedFavourites = state.unlikedFavourites;
      if (unlikedFavourites.includes(action.payload)) {
        const index = unlikedFavourites.indexOf(action.payload);
        unlikedFavourites.splice(index, 1);
      }
      return {
        ...state,
        loading: false,
        unlikedFavourites: [...unlikedFavourites],
      };
    }
    case GET_FAVOURITE_PROPERTIES_ERROR:
    case LIKE_PROPERTY_ERROR:
    case UNLIKE_PROPERTY_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
