import { Alert } from 'react-native';
import { Dispatch } from 'redux';
import * as Routes from 'src/constants/routes';
import { apiRequest } from 'src/services/api';
import * as NavigationService from 'src/services/NavigationService';
import StorageAsync from 'src/services/Storage';
import { reverseConvertSearchAction } from 'src/utils/searchActionHelper';
import { clearStorage } from 'src/utils/storage';
import { ACCESS_TOKEN, ONBOARDING_COMPLETED } from 'src/utils/storageKeys';
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
  SEND_EMAIL_TO_SUPPORT,
  SEND_EMAIL_TO_SUPPORT_ERROR,
  SEND_EMAIL_TO_SUPPORT_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
  UPLOAD_AVATAR,
  UPLOAD_AVATAR_ERROR,
  UPLOAD_AVATAR_SUCCESS,
  UPDATE_SEARCH,
  UPDATE_NOTIFICATION_SETTINGS,
  UPDATE_NOTIFICATION_SETTINGS_SUCCESS,
  UPDATE_NOTIFICATION_SETTINGS_ERROR,
  GET_NOTIFICATION_SETTINGS_SUCCESS,
  GET_NOTIFICATION_SETTINGS,
  GET_NOTIFICATION_SETTINGS_ERROR,
  GET_USER_PREMIUM,
  GET_USER_PREMIUM_SUCCESS,
  GET_USER_PREMIUM_ERROR,
} from './../actionTypes';

export const loadProfile =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: LOAD_PROFILE });

      const res = await apiRequest({
        method: 'get',
        url: '/users',
      });

      dispatch({
        type: LOAD_PROFILE_SUCCESS,
        payload: res,
      });

      if (res?.data?.search) {
        const action = res.data.search.query?.action ? reverseConvertSearchAction(res.data.search.query?.action) : undefined;
        res.data.search.query.action = action;
        dispatch({
          type: UPDATE_SEARCH,
          payload: res.data?.search,
        });
      }
    } catch (error) {
      dispatch({
        type: LOAD_PROFILE_ERROR,
        payload: error,
      });
    }
  };

export const updateUser =
  (data) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: UPDATE_USER });

      await apiRequest({
        method: 'put',
        url: '/users',
        data,
      });

      dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: error,
      });
    }
  };

export const sendEmailToSupport =
  (data) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: SEND_EMAIL_TO_SUPPORT });

      const res = await apiRequest({
        method: 'post',
        url: '/users/support',
        data,
      });

      dispatch({
        type: SEND_EMAIL_TO_SUPPORT_SUCCESS,
        payload: res,
      });

      Alert.alert('', 'Your request has been successfully sent to Domally support team', [{ text: 'OK', onPress: () => NavigationService.goBack() }]);
    
    } catch (error) {
      dispatch({
        type: SEND_EMAIL_TO_SUPPORT_ERROR,
        payload: error,
      });
    }
  };

export const removeAccount =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: REMOVE_PROFILE });

      await apiRequest({
        method: 'delete',
        url: '/users',
      });

      dispatch({ type: REMOVE_PROFILE_SUCCESS, payload: {} });
      await StorageAsync.remove(ACCESS_TOKEN);
      await clearStorage();
      NavigationService.navigate(Routes.Profile, { screen: Routes.Profile });
    } catch (error) {
      dispatch({
        type: REMOVE_PROFILE_ERROR,
        payload: error,
      });
    }
  };

export const fetchFaqSettings =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: FETCH_FAQ_SETTINGS });

      var data = await (await fetch('https://domally-static-content.s3.us-east-2.amazonaws.com/profile/faqSettings.json')).json();

      if (data) {
        dispatch({ type: FETCH_FAQ_SETTINGS_SUCCESS, payload: data });
      }
    } catch (error) {
      dispatch({
        type: FETCH_FAQ_SETTINGS_ERROR,
        payload: error,
      });
    }
  };

export const uploadAvatar =
  (fileUri: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: UPLOAD_AVATAR });

      const fileType = fileUri.split('.').pop();
      const s3SignedUrl = await apiRequest({
        method: 'get',
        url: `/files/get-s3-signed-avatar-url/${fileType}`,
      });

      const resp = await fetch(fileUri);
      const fileBody = await resp.blob();

      var uploadToS3Result = await fetch(s3SignedUrl.data.url, {
        method: 'PUT',
        body: fileBody,
      });

      if (uploadToS3Result.status == 200) {
        const data = { avatar: s3SignedUrl.data.fileLocation };

        await apiRequest({
          method: 'put',
          url: '/users',
          data,
        });

        dispatch({
          type: UPLOAD_AVATAR_SUCCESS,
          payload: { avatar: `${s3SignedUrl.data.fileLocation}?v=${Date.now()}` },
        });
      }
    } catch (error) {
      dispatch({
        type: UPLOAD_AVATAR_ERROR,
        payload: error,
      });
    }
  };

export const getNotificationSettings =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_NOTIFICATION_SETTINGS });

      const res = await apiRequest({
        method: 'get',
        url: '/users/get-user-notification-settings',
      });

      dispatch({
        type: GET_NOTIFICATION_SETTINGS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_NOTIFICATION_SETTINGS_ERROR,
        payload: error,
      });
    }
  };

export const updateNotificationSettings =
  (notificationSettings) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: UPDATE_NOTIFICATION_SETTINGS });

      await apiRequest({
        method: 'put',
        url: '/users/update-user-notification-settings',
        data: notificationSettings,
      });

      dispatch({
        type: UPDATE_NOTIFICATION_SETTINGS_SUCCESS,
        payload: notificationSettings,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_NOTIFICATION_SETTINGS_ERROR,
        payload: error,
      });
    }
  };


  export const getPremiumStatus =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_USER_PREMIUM });

      const res = await apiRequest({
        method: 'get',
        url: '/payment/get-premium-status',
      });

      dispatch({ type: GET_USER_PREMIUM_SUCCESS, payload: res.data ? res.data : undefined });

    } catch (error) {
      dispatch({
        type: GET_USER_PREMIUM_ERROR,
        payload: error,
      });
    }
  };