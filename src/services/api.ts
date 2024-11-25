import { API_URL } from '@env';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import * as Routes from 'src/constants/routes';
import { RESET_PROPERTIES, USER_LOGOUT_SUCCESS } from 'src/redux/actionTypes';
import store from 'src/redux/store';
import * as NavigationService from 'src/services/NavigationService';
import StorageAsync from 'src/services/Storage';
import { getLocalAccessToken } from 'src/utils/storage';
import { ACCESS_TOKEN } from 'src/utils/storageKeys';

const basicConfig: AxiosRequestConfig = {
  baseURL: `${API_URL}/api/v1`,
};

const apiInstance = axios.create(basicConfig);

apiInstance.interceptors.request.use(async (configuration: AxiosRequestConfig) => {
  const accessToken = await getLocalAccessToken();
  
  return {
    ...configuration,
    headers: {
      ...configuration.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };
});

const publicApi = axios.create(basicConfig);

export const apiRequest = async (configuration: AxiosRequestConfig) => {
  console.log('REQUEST: ', JSON.stringify(configuration));

  try {
    const result = await apiInstance({
      ...configuration,
      headers: {
        ...configuration.headers,
      },
    });
  
    if (result.status >= 200 && result.status < 400) {
      return result;
    } else {
      throw new Error(`Something get wrong with request: ${result}`);
    }

    return result;
  } catch (error) {
    console.log('REQUEST ERROR: ', configuration);

    if (error.response.status === 401) {
      await StorageAsync.remove(ACCESS_TOKEN);
      store.dispatch({ type: USER_LOGOUT_SUCCESS, payload: {} });
      store.dispatch({ type: RESET_PROPERTIES });
      NavigationService.navigate(Routes.SignIn, {});
      return;
    }
    onError(error);
  }
};

export const publicApiRequest = async (configuration: AxiosRequestConfig, showError: boolean = true) => {
  console.log('REQUEST: ', configuration);

  try {
    const result = await publicApi({
      ...configuration,
      headers: {
        ...configuration.headers,
      },
    });

    if (result.status >= 200 && result.status < 400) {
      return result;
    } else {
      throw new Error(`Something get wrong with request: ${result}`);
    }
  } catch (error) {
    onError(error, showError);
  }
};

const onError = (error: AxiosError, showError: boolean = true) => {
  if (error.response) {
    // Request was made but server responded with something other than 2xx
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  } else {
    console.error('Error Message:', error.message);
  }
  if (showError) {
    Alert.alert('ERROR', JSON.stringify(error.message));
  }
  throw new Error(`Something get wrong with request: ${error}`);
};
