import { Dispatch } from 'redux';
import { apiRequest } from 'src/services/api';
import {
  GET_FAVOURITE_PROPERTIES,
  GET_FAVOURITE_PROPERTIES_ERROR,
  GET_FAVOURITE_PROPERTIES_SUCCESS,
  LIKE_PROPERTY,
  LIKE_PROPERTY_ERROR,
  LIKE_PROPERTY_SUCCESS,
  UNLIKE_PROPERTY,
  UNLIKE_PROPERTY_ERROR,
  UNLIKE_PROPERTY_SUCCESS,
} from './../actionTypes';

export const getFavouriteProperties =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_FAVOURITE_PROPERTIES });

      const res = await apiRequest({
        method: 'get',
        url: `/properties/favourites`,
      });

      dispatch({
        type: GET_FAVOURITE_PROPERTIES_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_FAVOURITE_PROPERTIES_ERROR,
        payload: error,
      });
    }
  };

export const likeProperty =
  (id: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: LIKE_PROPERTY });

      await apiRequest({
        method: 'post',
        url: `/properties/like-property/${id}`,
      });

      dispatch({
        type: LIKE_PROPERTY_SUCCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: LIKE_PROPERTY_ERROR,
        payload: error,
      });
    }
  };

export const unlikeProperty =
  (id: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: UNLIKE_PROPERTY });

      await apiRequest({
        method: 'post',
        url: `/properties/unlike-property/${id}`,
      });

      dispatch({
        type: UNLIKE_PROPERTY_SUCCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: UNLIKE_PROPERTY_ERROR,
        payload: error,
      });
    }
  };
