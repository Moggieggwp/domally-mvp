import { Dispatch } from 'redux';
import { apiRequest } from 'src/services/api';
import { FCM_DEVICE_TOKEN } from 'src/utils/storageKeys';
import { SAVE_FCM_TOKEN, SAVE_FCM_TOKEN_ERROR, SAVE_FCM_TOKEN_SUCCESS } from '../actionTypes';
import Storage from 'src/services/Storage';

export const saveFcmToken =
  (token: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: SAVE_FCM_TOKEN });

      const res = await apiRequest({
        method: 'post',
        url: '/users/device',
        data: {
          token,
        },
      });

      dispatch({
        type: SAVE_FCM_TOKEN_SUCCESS,
        payload: res.data,
      });

     await Storage.setValue(FCM_DEVICE_TOKEN, token);

    } catch (error) {
      console.log('SAVE FCM TOKEN ERROR:', JSON.stringify(error));

      dispatch({
        type: SAVE_FCM_TOKEN_ERROR,
        payload: error,
      });
    }
  };


  export const removeFcmToken =
  () =>
  async (): Promise<void> => {
    try {
      const token = await Storage.getValue(FCM_DEVICE_TOKEN);

      await apiRequest({
        method: 'delete',
        url: '/users/device',
        data: {
          token,
        },
      });

     await Storage.remove(FCM_DEVICE_TOKEN);
    } catch (error) {
      console.log('DELETE FCM TOKEN ERROR:', JSON.stringify(error));
    }
  };