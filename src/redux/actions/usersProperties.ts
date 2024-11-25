import { Dispatch } from 'redux';
import { apiRequest } from 'src/services/api';
import { ActionType, PropertyStatus } from 'src/types';
import {
  GET_PROPERTIES,
  GET_PROPERTIES_ERROR,
  GET_PROPERTIES_SUCCESS,
  SET_PROPERTY_FIlTER,
} from './../actionTypes';

export const getUsersProperties =
  (status?: PropertyStatus) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_PROPERTIES });

      const res = await apiRequest({
        method: 'get',
        url: `/properties`,
        params: {
          status: status,
        }
      });

      dispatch({
        type: GET_PROPERTIES_SUCCESS,
        payload: res.data.properties,
      });
    } catch (error) {
      dispatch({
        type: GET_PROPERTIES_ERROR,
        payload: error,
      });
    }
  };

export const setPropertiesFilter = (filter: PropertyStatus): ActionType => {
  return {
    type: SET_PROPERTY_FIlTER,
    payload: filter,
  };
};
