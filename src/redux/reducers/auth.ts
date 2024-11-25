import {
  USER_LOGIN,
  USER_LOGIN_ERROR,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_LOGOUT_ERROR,
  USER_LOGOUT_SUCCESS,
  USER_SIGNUP,
  USER_SIGNUP_ERROR,
  USER_SIGNUP_SUCCESS,
  CHANGE_PHONE_NUMBER,
  CHANGE_PHONE_NUMBER_SUCCESS,
  CHANGE_PHONE_NUMBER_ERROR,
} from 'src/redux/actionTypes';
import { IAuthState } from 'src/types';

interface ActionType {
  type: string;
  payload: any;
}

const initialState: IAuthState = {
  user: undefined,
  loginError: null,
  signUpError: null,
  logOutError: null,
  isSignedIn: false,
  newUser: false,
  loading: false,
};

const user = (state = initialState, action: ActionType): IAuthState => {
  switch (action.type) {
    case USER_LOGIN: {
      return {
        ...state,
        loading: true,
      };
    }
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isSignedIn: true,
        newUser: false,
        loading: false,
      };
    case USER_SIGNUP: {
      return {
        ...state,
        loading: true,
      };
    }
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isSignedIn: false,
        newUser: true,
        loading: false,
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
        user: null,
        isSignedIn: false,
        loading: false,
      };
    }
    case USER_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
        loading: false,
      };
    case USER_SIGNUP_ERROR:
      return {
        ...state,
        signUpError: action.payload,
        loading: false,
      };
    case USER_LOGOUT_ERROR:
      return {
        ...state,
        loading: false,
      };
    case CHANGE_PHONE_NUMBER:
      return {
        ...state,
        loading: true,
      }
    case CHANGE_PHONE_NUMBER_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case CHANGE_PHONE_NUMBER_ERROR:
        return {
          ...state,
          loading: false,
        };
    default:
      return state;
  }
};

export default user;
