import { AnyAction, Dispatch } from 'redux';
import {
  GET_POPULAR_LOCATION,
  GET_POPULAR_LOCATION_SUCCESS,
  GET_POPULAR_LOCATION_ERROR,
  SET_ONBOARDING_ACTION,
  SEND_USERS_FEEDBACK,
  SEND_USERS_FEEDBACK_ERROR,
  SEND_USERS_FEEDBACK_SUCCESS,
  SET_APP_IS_OPEN,
  SET_APP_IS_OPEN_ERROR,
  SET_APP_IS_OPEN_SUCCESS,
  SET_APP_METRICS,
  GET_MEASURE_RATES_ERROR,
  GET_MEASURE_RATES,
  GET_MEASURE_RATES_SUCCESS,
  GET_MIN_APP_VERSION,
  GET_MIN_APP_VERSION_SUCCESS,
  GET_MIN_APP_VERSION_ERROR,
  ACKNOWLEDGE_PURCHASE,
  ACKNOWLEDGE_PURCHASE_SUCCESS,
  ACKNOWLEDGE_PURCHASE_ERROR,
} from './../actionTypes';
import { Action, AppMetrics, IAction, UsersFeedback } from 'src/types';
import { publicApiRequest, apiRequest } from 'src/services/api';
import { CURRENCY_DEFAULT_SETTING, SQUARE_DEFAULT_SETTING } from 'src/utils/storageKeys';
import StorageAsync from 'src/services/Storage';

export const getPopularLocations =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_POPULAR_LOCATION });

      const res = await publicApiRequest({
        method: 'get',
        url: '/users/popular-locations',
      });

      dispatch({
        type: GET_POPULAR_LOCATION_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.log('getPopularLocations ERROR:', JSON.stringify(error));

      dispatch({
        type: GET_POPULAR_LOCATION_ERROR,
        payload: error,
      });
    }
  };

export const appIsOpen =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: SET_APP_IS_OPEN });

      const res = await apiRequest({
        method: 'put',
        url: '/users/open',
      });

      dispatch({
        type: SET_APP_IS_OPEN_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.log('appIsOpen ERROR:', JSON.stringify(error));

      dispatch({
        type: SET_APP_IS_OPEN_ERROR,
        payload: error,
      });
    }
  };

export const sendUserFeedback =
  (data: UsersFeedback) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: SEND_USERS_FEEDBACK });

      const res = await apiRequest({
        method: 'post',
        url: '/user-answer',
        data,
      });

      dispatch({ type: SEND_USERS_FEEDBACK_SUCCESS });
    } catch (error) {
      console.log('getPopularLocations ERROR:', JSON.stringify(error));

      dispatch({
        type: SEND_USERS_FEEDBACK_ERROR,
        payload: error,
      });
    }
  };

export const setOnboardingAction = (data: Action): IAction<Action> => {
  return {
    type: SET_ONBOARDING_ACTION,
    payload: data,
  };
};

export const setAppMetrics =
  (data: Partial<AppMetrics>) =>
  async (dispatch: Dispatch): Promise<void> => {
    if (!data) return;

    if (data.currency) {
      await StorageAsync.setValue(CURRENCY_DEFAULT_SETTING, data.currency);
    }

    if (data.square) {
      await StorageAsync.setValue(SQUARE_DEFAULT_SETTING, data.square);
    }

    dispatch({
      type: SET_APP_METRICS,
      payload: data,
    });
  };

export const getAppMeasureRates =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_MEASURE_RATES });

      const res = await apiRequest({
        method: 'get',
        url: '/users/measure-rates',
      });

      dispatch({
        type: GET_MEASURE_RATES_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.log('getAppMeasureRates ERROR:', JSON.stringify(error));

      dispatch({
        type: GET_MEASURE_RATES_ERROR,
        payload: error,
      });
    }
  };

  export const getMinAppVersion =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_MIN_APP_VERSION });

      const res = await apiRequest({
        method: 'get',
        url: '/health/min-app-version',
      });

      dispatch({
        type: GET_MIN_APP_VERSION_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_MIN_APP_VERSION_ERROR,
        payload: error,
      });
    }
  };

  export const acknowledgePurchase =
  (data) =>
  async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
      dispatch({ type: ACKNOWLEDGE_PURCHASE });

      const res = await apiRequest({
        method: 'post',
        url: '/payment/acknowledge-purchase',
        data,
      });

      dispatch({ type: ACKNOWLEDGE_PURCHASE_SUCCESS });

    } catch (error) {
      dispatch({
        type: ACKNOWLEDGE_PURCHASE_ERROR,
        payload: error,
      });
    }
  };

