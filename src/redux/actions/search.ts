import analytics from '@react-native-firebase/analytics';
import { SearchQueryDto } from 'domally-utils';
import { Action, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { apiRequest } from 'src/services/api';
import { SearchData, SearchType } from 'src/types';
import { convertSearchAction } from 'src/utils/searchActionHelper';
import { setLocalSearchData } from 'src/utils/storage';
import { IRootState } from '../store';
import {
  CLEAR_SEARCH,
  CLEAR_SEARCH_RANGE,
  GET_PROPERTY_DETAILS,
  GET_PROPERTY_DETAILS_ERROR,
  GET_PROPERTY_DETAILS_SUCCESS,
  GET_PROPERTY_USER,
  GET_PROPERTY_USER_ERROR,
  GET_PROPERTY_USER_SUCCESS,
  PARTIAL_SEARCH_CLEAR,
  SEARCH_PROPERTIES,
  SEARCH_PROPERTIES_COUNT_SUCCESS,
  SEARCH_PROPERTIES_ERROR,
  SEARCH_PROPERTIES_MAP_SUCCESS,
  SEARCH_PROPERTIES_SUCCESS,
  SEARCH_RANGES_SUCCESS,
  SEND_PROPERTY_CLAIM,
  SEND_PROPERTY_CLAIM_ERROR,
  SEND_PROPERTY_CLAIM_SUCCESS,
  UPDATE_SEARCH,
  UPDATE_SEARCH_QUERY,
} from './../actionTypes';

export const searchProperties =
  () =>
  async (dispatch: Dispatch, getState: () => IRootState): Promise<void> => {
    const searchData = getState().search.searchData;

    dispatch({ type: SEARCH_PROPERTIES });

    const action = searchData?.query?.action ? convertSearchAction(searchData.query.action) : undefined;

    try {
      const result = await apiRequest({
        method: 'POST',
        url: 'properties/search',
        data: { ...searchData, query: { ...searchData.query, action } },
      });
      
      analytics().logEvent('search_location', { location: searchData.query?.location?.city });

      await setLocalSearchData(searchData);

      if (result?.data?.ranges) {
        dispatch({
          type: SEARCH_RANGES_SUCCESS,
          payload: result?.data?.ranges,
        });
      }

      if (searchData.searchType === SearchType.COUNT) {
        dispatch({
          type: SEARCH_PROPERTIES_COUNT_SUCCESS,
          payload: result?.data?.count || 0,
        });
      }
      if (searchData.searchType === SearchType.LIST) {
        dispatch({
          type: SEARCH_PROPERTIES_SUCCESS,
          payload: result.data.properties,
        });
      }
      if (searchData.searchType === SearchType.MAP) {
        dispatch({
          type: SEARCH_PROPERTIES_MAP_SUCCESS,
          payload: result.data.properties,
        });
      }
    } catch (error) {
      dispatch({
        type: SEARCH_PROPERTIES_ERROR,
        payload: error,
      });
    }
  };

export const updateSearchFilter =
  (data: SearchQueryDto, doSearch: boolean = true) =>
  async (dispatch: ThunkDispatch<any, void, Action>): Promise<void> => {
    dispatch({
      type: UPDATE_SEARCH_QUERY,
      payload: data,
    });

    if (doSearch) {
      await dispatch(searchProperties());
    }
  };

export const updateSearchData =
  (data: SearchData, doSearch: boolean = true) =>
  async (dispatch: ThunkDispatch<any, void, Action>): Promise<void> => {
    dispatch({
      type: UPDATE_SEARCH,
      payload: data,
    });

    if (doSearch) {
      await dispatch(searchProperties());
    }
  };

export const clearSearch = () => {
  return {
    type: CLEAR_SEARCH,
  };
};

export const getPropertyUser =
  (userId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_PROPERTY_USER });

      const res = await apiRequest({
        method: 'get',
        url: `/users/${userId}`,
      });

      dispatch({
        type: GET_PROPERTY_USER_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_PROPERTY_USER_ERROR,
        payload: error,
      });
    }
  };

export const sendPropertyClaim =
  (data) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: SEND_PROPERTY_CLAIM });

      await apiRequest({
        method: 'post',
        url: '/properties/add-claim',
        data,
      });

      dispatch({
        type: SEND_PROPERTY_CLAIM_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: SEND_PROPERTY_CLAIM_ERROR,
        payload: error,
      });
    }
  };

export const getPropertyDetails =
  (propertyId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: GET_PROPERTY_DETAILS });

      const res = await apiRequest({
        method: 'get',
        url: `/properties/${propertyId}`,
      });

      dispatch({
        type: GET_PROPERTY_DETAILS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_PROPERTY_DETAILS_ERROR,
        payload: error,
      });
    }
  };

export const partialSearchClear = (searchQuery: SearchQueryDto) => {
  return {
    type: PARTIAL_SEARCH_CLEAR,
    payload: searchQuery,
  };
};

export const clearSearchRange = () => {
  return {
    type: CLEAR_SEARCH_RANGE,
  };
};
