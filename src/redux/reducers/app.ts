import { IAction, IAppState } from 'src/types/redux';
import {
  GET_POPULAR_LOCATION,
  GET_POPULAR_LOCATION_SUCCESS,
  GET_POPULAR_LOCATION_ERROR,
  SET_ONBOARDING_ACTION,
  SEND_USERS_FEEDBACK,
  SEND_USERS_FEEDBACK_SUCCESS,
  SEND_USERS_FEEDBACK_ERROR,
  SET_APP_IS_OPEN,
  SET_APP_IS_OPEN_ERROR,
  SET_APP_IS_OPEN_SUCCESS,
  SET_APP_METRICS,
  GET_MEASURE_RATES,
  GET_MEASURE_RATES_SUCCESS,
  GET_MEASURE_RATES_ERROR,
  GET_MIN_APP_VERSION_ERROR,
  GET_MIN_APP_VERSION,
  GET_MIN_APP_VERSION_SUCCESS,
} from './../actionTypes';
import { OPTIONS as LocationOptions } from 'src/constants/search/LocationOptions';

const defaultAppState: IAppState = {
  popularLocations: undefined,
  onboardingAction: undefined,
  loading: false,
  error: undefined,
  popupsToShow: undefined,
  metrics: undefined,
  measureRates: undefined,
  minAppVersion: undefined,
};

export default function appReducer(state = defaultAppState, action: IAction<any>): IAppState {
  switch (action.type) {
    case GET_POPULAR_LOCATION:
    case SET_APP_IS_OPEN:
    case SEND_USERS_FEEDBACK:
      return {
        ...state,
        loading: true,
      };
    case GET_POPULAR_LOCATION_SUCCESS:
      return {
        ...state,
        popularLocations: action.payload,
        loading: false,
      };
    case GET_POPULAR_LOCATION_ERROR:
      return {
        ...state,
        popularLocations: LocationOptions,
        error: action.payload,
        loading: false,
      };
    case SET_APP_IS_OPEN_SUCCESS:
      return {
        ...state,
        loading: false,
        popupsToShow: action.payload,
      };
    case SEND_USERS_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case SEND_USERS_FEEDBACK_ERROR:
    case SET_APP_IS_OPEN_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SET_ONBOARDING_ACTION:
      return {
        ...state,
        onboardingAction: action.payload,
      };
    case SET_APP_METRICS:
      return {
        ...state,
        metrics: { ...state.metrics, ...action.payload },
      };
    case GET_MEASURE_RATES:
      return {
        ...state,
        loading: true,
      };
    case GET_MEASURE_RATES_SUCCESS:
      return {
        ...state,
        measureRates: action.payload,
        loading: false,
      };
    case GET_MIN_APP_VERSION:
      return {
        ...state,
        loading: true,
      };
    case GET_MIN_APP_VERSION_SUCCESS:
      return {
        ...state,
        minAppVersion: action.payload,
        loading: false,
      };
    case GET_MEASURE_RATES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_MIN_APP_VERSION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
