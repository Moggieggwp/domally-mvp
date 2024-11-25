import {
  SAVE_PROPERTY,
  SAVE_PROPERTY_SUCCESS,
  RESET_CURRENT_PROPERTY,
  UPDATE_CURRENT_PROPERTY,
  SAVE_PROPERTY_ERROR,
  DELETE_PROPERTY_SUCCESS,
  DELETE_PROPERTY_ERROR,
  DELETE_PROPERTY,
  UPLOAD_PROPERTY_PHOTOS,
  UPLOAD_PROPERTY_PHOTOS_SUCCESS,
  UPLOAD_PROPERTY_PHOTOS_ERROR,
} from 'src/redux/actionTypes';
import { ICurrentPropertyState, CurrentPropertyActionType } from 'src/types';

const initialState: ICurrentPropertyState = {
  id: undefined,
  action: undefined,
  type: undefined,
  detailedType: undefined,
  location: undefined,
  size: undefined,
  price: undefined,
  residentialData: undefined,
  loading: false,
  error: undefined,
  virtualShowings: undefined,
  zoningCode: undefined,
  description: undefined,
  squareDetails: undefined,
};

const currentProperty = (state = initialState, action: CurrentPropertyActionType): ICurrentPropertyState => {
  switch (action.type) {
    case SAVE_PROPERTY:
    case DELETE_PROPERTY:
    case UPLOAD_PROPERTY_PHOTOS:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_CURRENT_PROPERTY:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_PROPERTY_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case DELETE_PROPERTY_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPLOAD_PROPERTY_PHOTOS_SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.payload,
      }
    case SAVE_PROPERTY_ERROR:
    case DELETE_PROPERTY_ERROR:
    case UPLOAD_PROPERTY_PHOTOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RESET_CURRENT_PROPERTY:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default currentProperty;
