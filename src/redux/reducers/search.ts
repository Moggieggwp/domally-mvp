import {
  CLEAR_SEARCH,
  CLEAR_SEARCH_RANGE,
  GET_PROPERTY_DETAILS,
  GET_PROPERTY_DETAILS_ERROR,
  GET_PROPERTY_DETAILS_SUCCESS,
  GET_PROPERTY_USER,
  GET_PROPERTY_USER_ERROR,
  GET_PROPERTY_USER_SUCCESS,
  LIKE_PROPERTY,
  LIKE_PROPERTY_ERROR,
  LIKE_PROPERTY_SUCCESS,
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
  UNLIKE_PROPERTY,
  UNLIKE_PROPERTY_ERROR,
  UNLIKE_PROPERTY_SUCCESS,
  UPDATE_SEARCH,
  UPDATE_SEARCH_QUERY,
} from 'src/redux/actionTypes';
import { ISearchState, SearchActionType, SearchType } from 'src/types';

const initialState: ISearchState = {
  searchData: {
    searchType: undefined,
    currency: undefined,
    square: undefined,
    cursor: undefined,
    filter: undefined,
    query: {
      location: undefined,
      action: undefined,
      type: undefined,
      detailedType: undefined,
      size: undefined,
      price: undefined,
      commercialData: undefined,
      residentialData: undefined,
    },
  },
  loading: false,
  searchResult: [],
  searchResultMap: [],
  searchResultCount: undefined,
  searchResultRanges: undefined,
  propertyUserProfile: undefined,
  propertyDetails: undefined,
};

const search = (state = initialState, action: SearchActionType): ISearchState => {
  switch (action.type) {
    case UPDATE_SEARCH_QUERY:
      const updatesSearchDataQuery = {
        ...state.searchData.query,
        ...action.payload,
      };
      return {
        ...state,
        searchData: {
          ...state.searchData,
          query: updatesSearchDataQuery,
        },
      };
    case UPDATE_SEARCH:
      const updatesSearchData = {
        ...state.searchData,
        ...action.payload,
      };
      return {
        ...state,
        searchData: updatesSearchData,
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        searchData: { ...initialState.searchData, searchType: SearchType.COUNT },
        loading: false,
      };
    case PARTIAL_SEARCH_CLEAR:
      return {
        ...state,
        searchData: {
          ...state.searchData,
          query: { ...initialState.searchData.query, ...action.payload },
        },
        loading: false,
      };
    case CLEAR_SEARCH_RANGE:
      return {
        ...state,
        searchData: {
          ...state.searchData,
          query: {
            ...state.searchData.query,
            price: { range: undefined, measure: undefined },
            size: { range: undefined, measure: undefined },
          },
        },
        searchResultRanges: initialState.searchResultRanges,
        loading: false,
      };
    case SEARCH_PROPERTIES:
      return {
        ...state,
        loading: true,
      };
    case SEARCH_PROPERTIES_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResult: action.payload,
      };
    case SEARCH_PROPERTIES_MAP_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResultMap: action.payload,
      };
    case SEARCH_PROPERTIES_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResultCount: action.payload,
      };
    case SEARCH_RANGES_SUCCESS:
      const updatesSearchDataRanges = {
        ...state.searchResultRanges,
        ...action.payload,
      };
      return {
        ...state,
        loading: false,
        searchResultRanges: updatesSearchDataRanges,
      };
    case SEARCH_PROPERTIES_ERROR:
      return {
        ...state,
        loading: false,
      };
    case GET_PROPERTY_USER:
      return {
        ...state,
        loading: true,
      };
    case GET_PROPERTY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyUserProfile: action.payload,
      };
    case GET_PROPERTY_USER_ERROR:
      return {
        ...state,
        loading: false,
      };
    case GET_PROPERTY_DETAILS:
      return {
        ...state,
        loading: true,
      };
    case GET_PROPERTY_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyDetails: action.payload,
      };
    case GET_PROPERTY_DETAILS_ERROR:
      return {
        ...state,
        loading: false,
      };
    case SEND_PROPERTY_CLAIM:
      return {
        ...state,
        loading: true,
      };
    case SEND_PROPERTY_CLAIM_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case SEND_PROPERTY_CLAIM_ERROR:
      return {
        ...state,
        loading: false,
      };
    case UNLIKE_PROPERTY: {
      return {
        ...state,
        loading: true,
      };
    }
    case UNLIKE_PROPERTY_SUCCESS: {
      let propertiesOnMap = state.searchResultMap;
      let unlikedPropertyIndex = propertiesOnMap.findIndex((x) => x.id === action.payload);
      if (unlikedPropertyIndex !== -1 ) {
        propertiesOnMap[unlikedPropertyIndex].hasLike = false;
      }
      unlikedPropertyIndex = null;
      let propertiesList = state.searchResult;
      unlikedPropertyIndex = propertiesList.findIndex((x) => x.id === action.payload);
      if (unlikedPropertyIndex !== -1 ) {
        propertiesList[unlikedPropertyIndex].hasLike = false;
      }

      return {
        ...state,
        loading: false,
        searchResultMap: [...propertiesOnMap],
        searchResult: [...propertiesList],
      };
    }
    case LIKE_PROPERTY: {
      return {
        ...state,
        loading: true,
      };
    }
    case LIKE_PROPERTY_SUCCESS: {
      let propertiesOnMap = state.searchResultMap;
      let likedPropertyIndex = propertiesOnMap.findIndex((x) => x.id === action.payload);
      if (likedPropertyIndex !== -1 ) {
        propertiesOnMap[likedPropertyIndex].hasLike = true;
      }
      likedPropertyIndex = null;
      let propertiesList = state.searchResult;
      likedPropertyIndex = propertiesList.findIndex((x) => x.id === action.payload);
      if (likedPropertyIndex !== -1 ) {
        propertiesList[likedPropertyIndex].hasLike = true;
      }

      return {
        ...state,
        loading: false,
        searchResultMap: [...propertiesOnMap],
        searchResult: [...propertiesList],
      };
    }
    case LIKE_PROPERTY_ERROR:
    case UNLIKE_PROPERTY_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default search;
