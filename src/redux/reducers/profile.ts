import { IAction, IProfileState } from 'src/types/redux';
import {
  FETCH_FAQ_SETTINGS,
  FETCH_FAQ_SETTINGS_ERROR,
  FETCH_FAQ_SETTINGS_SUCCESS,
  LOAD_PROFILE,
  LOAD_PROFILE_ERROR,
  LOAD_PROFILE_SUCCESS,
  REMOVE_PROFILE,
  REMOVE_PROFILE_ERROR,
  REMOVE_PROFILE_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
  USER_LOGOUT,
  UPLOAD_AVATAR,
  UPLOAD_AVATAR_SUCCESS,
  UPLOAD_AVATAR_ERROR,
  CHANGE_PHONE_NUMBER_SUCCESS,
  UPDATE_NOTIFICATION_SETTINGS,
  UPDATE_NOTIFICATION_SETTINGS_SUCCESS,
  UPDATE_NOTIFICATION_SETTINGS_ERROR,
  GET_NOTIFICATION_SETTINGS,
  GET_NOTIFICATION_SETTINGS_SUCCESS,
  GET_NOTIFICATION_SETTINGS_ERROR,
  USER_LOGOUT_SUCCESS,
  GET_USER_PREMIUM,
  GET_USER_PREMIUM_SUCCESS,
  GET_USER_PREMIUM_ERROR,
} from './../actionTypes';

const defaultAppState: IProfileState = {
  data: null,
  isSignedIn: false,
  loading: false,
  error: null,
  faqSettings: [],
  notificationSettings: null,
  premiumInfo: null,
};

export default function profile(state = defaultAppState, action: IAction<any>): IProfileState {
  switch (action.type) {
    case LOAD_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case LOAD_PROFILE_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isSignedIn: true,
        loading: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: { ...state.data, ...action.payload },
      };
    case USER_LOGOUT: {
      return {
        ...state,
        loading: true,
      };
    }
    case USER_LOGOUT_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: null,
        isSignedIn: false,
      };
    }
    case REMOVE_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_PROFILE_SUCCESS:
      return {
        ...state,
        data: null,
        isSignedIn: false,
        loading: false,
      };
    case FETCH_FAQ_SETTINGS:
      return {
        ...state,
        loading: true,
      };
    case FETCH_FAQ_SETTINGS_SUCCESS:
      return {
        ...state,
        faqSettings: action.payload,
        loading: false,
      };
    case UPLOAD_AVATAR: {
      return {
        ...state,
        loading: true,
      };
    }
    case UPLOAD_AVATAR_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: { ...state.data, ...action.payload },
      };
    }
    case CHANGE_PHONE_NUMBER_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: { ...state.data, phone: action.payload },
      };
    }
    case UPDATE_NOTIFICATION_SETTINGS: {
      return {
        ...state,
        loading: true,
      };
    }
    case UPDATE_NOTIFICATION_SETTINGS_SUCCESS: {
      return {
        ...state,
        notificationSettings: { ...state.notificationSettings, ...action.payload },
        loading: false,
      };
    }
    case GET_NOTIFICATION_SETTINGS: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_NOTIFICATION_SETTINGS_SUCCESS: {
      return {
        ...state,
        notificationSettings: action.payload,
        loading: false,
      };
    }
    case GET_USER_PREMIUM: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_USER_PREMIUM_SUCCESS: {
      return {
        ...state,
        premiumInfo: action.payload,
        loading: false,
      };
    }
    case GET_USER_PREMIUM_ERROR:
    case LOAD_PROFILE_ERROR:
    case UPDATE_USER_ERROR:
    case REMOVE_PROFILE_ERROR:
    case FETCH_FAQ_SETTINGS_ERROR:
    case UPLOAD_AVATAR_ERROR:
    case UPDATE_NOTIFICATION_SETTINGS_ERROR:
    case GET_NOTIFICATION_SETTINGS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
