import { Dispatch } from 'redux';
import * as Routes from 'src/constants/routes';
import { publicApiRequest, apiRequest } from 'src/services/api';
import * as NavigationService from 'src/services/NavigationService';
import StorageAsync from 'src/services/Storage';
import { IAuthCodeConfirm, IAuthData } from 'src/types';
import { setMainOnboardingCompleted } from 'src/utils/storage';
import { ACCESS_TOKEN } from 'src/utils/storageKeys';
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
  RESET_PROPERTIES,
} from './../actionTypes';
import { appIsOpen } from './app';
import { getPremiumStatus, loadProfile } from './profile';
import analytics from '@react-native-firebase/analytics';
import Websocket from 'src/services/Websocket';
import Notification from 'src/services/Notification';

export const getVerificationCode =
  (data: IAuthData, isChangingPhoneNumber: boolean, navigationParams: any) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: USER_SIGNUP });

      await publicApiRequest({
        method: 'post',
        url: '/auth/send-code',
        data: data,
      },
        false,
      );

      dispatch({
        type: USER_SIGNUP_SUCCESS,
        payload: {
          phone: data.phone,
        },
      });

      NavigationService.navigate(Routes.ConfirmationCode, { isChangingPhoneNumber, navigationParams });
    } catch (error) {
      console.log('getVerificationCode error:', JSON.stringify(error));
      dispatch({
        type: USER_SIGNUP_ERROR,
        payload: error,
      });
    }
  };

export const sendVerificationCode =
  (data: IAuthCodeConfirm, navigationParams: any) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch({ type: USER_LOGIN });

      const res = await publicApiRequest(
        {
          method: 'post',
          url: '/auth/verify-code',
          data,
        },
        false,
      );

      await StorageAsync.setValue(ACCESS_TOKEN, res.data.accessToken);
      await Websocket.connect();

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          accessToken: res.data.accessToken,
        },
      });

      dispatch(loadProfile());
      dispatch(getPremiumStatus());
      dispatch(appIsOpen());

      analytics().setUserId(res.data.userId.toString());
      analytics().logLogin({ method: 'verification_code' });

      const isOnboarded = !res.data.newUser;
      if (isOnboarded) {
        await setMainOnboardingCompleted();
        NavigationService.navigate(Routes.Home, { ...navigationParams })
      } else {
        NavigationService.navigate(Routes.ChooseGoal, {});
      }

    } catch (error) {
      dispatch({
        type: USER_SIGNUP_ERROR,
        payload: error,
      });
    }
  };

export const clearAuthErrors =
  (type: string) =>
  (dispatch: Dispatch): void => {
    if (type === 'login') {
      dispatch({
        type: USER_LOGIN_ERROR,
        payload: {},
      });
    } else {
      dispatch({
        type: USER_SIGNUP_ERROR,
        payload: {},
      });
    }
  };

export const logOut =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: USER_LOGOUT });

      const res = await apiRequest({
        method: 'delete',
        url: '/auth/logout',
      });

      await StorageAsync.remove(ACCESS_TOKEN);
      dispatch({ type: USER_LOGOUT_SUCCESS, payload: {} });
      dispatch({ type: RESET_PROPERTIES });
      NavigationService.navigate(Routes.SignIn, {});
      Notification.setBadge(0);
      Websocket.disconnect();
    } catch (error) {
      console.log('logOut error:', error);
      dispatch({
        type: USER_LOGOUT_ERROR,
        payload: error,
      });
    }
  };

export const changePhoneNumber =
  (data: IAuthCodeConfirm) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: CHANGE_PHONE_NUMBER });

      await apiRequest({
        method: 'put',
        url: '/users/change-phone-number',
        data,
      });

      dispatch({ type: CHANGE_PHONE_NUMBER_SUCCESS, payload: data.phone });
      NavigationService.navigate(Routes.ChangePhoneNumberSuccess, {});
    } catch (error) {
      dispatch({
        type: CHANGE_PHONE_NUMBER_ERROR,
        payload: error,
      });
    }
  };
