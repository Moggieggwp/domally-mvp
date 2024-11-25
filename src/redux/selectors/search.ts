import { createSelector } from 'reselect';
import { IRootState } from 'src/redux/store';
import { SearchData, ISearchState } from 'src/types';

export const searchSelector = (state: IRootState): ISearchState => state.search;

export const searchDataSelector = (state: IRootState): SearchData => state.search.searchData;

export const searchLoadingSelector = createSelector(searchSelector, search => search.loading);

export const searchResultSelector = createSelector(searchSelector, search => search.searchResult);

export const searchResultMapSelector = createSelector(searchSelector, search => search.searchResultMap);

export const searchResultCountSelector = createSelector(searchSelector, search => search.searchResultCount);

export const searchResultRanges = createSelector(searchSelector, search => search.searchResultRanges);

export const searchLocation = createSelector(searchDataSelector, search => search.query?.location);

export const searchAction = createSelector(searchDataSelector, search => search.query?.action);

export const searchType = createSelector(searchDataSelector, search => search.query?.type);

export const searchDetailedType = createSelector(searchDataSelector, search => search.query?.detailedType);

export const searchResidentialNumberOfBathrooms = createSelector(searchDataSelector, search => search.query?.residentialData?.residentialNumberOfBathrooms);

export const searchResidentialNumberOfBedrooms = createSelector(searchDataSelector, search => search.query?.residentialData?.residentialNumberOfBedrooms);

export const searchResidentialNumberOfSpots = createSelector(searchDataSelector, search => search.query?.residentialData?.numberOfSpots);

export const searchResidentialAdditions = createSelector(searchDataSelector, search => search.query?.residentialData?.residentialAdditions);

export const searchSize = createSelector(searchDataSelector, search => search.query?.size);

export const searchPrice = createSelector(searchDataSelector, search => search.query?.price);

export const searchCommercialNumberOfUnits = createSelector(searchDataSelector, search => search.query?.commercialData?.commercialUnits);

export const searchCommercialResidentialUnits = createSelector(searchDataSelector, search => search.query?.commercialData?.commercialResidentialUnits);

export const searchCommercialNumberOfCommercialUnits = createSelector(searchDataSelector, search => search.query?.commercialData?.numberOfCommercialUnits);

export const searchResidentialData = createSelector(searchDataSelector, search => search.query?.residentialData);

export const searchCommercialData = createSelector(searchDataSelector, search => search.query?.commercialData);

export const propertyUserProfileSelector = createSelector(searchSelector, search => search.propertyUserProfile);

export const propertyDetailsSelector = createSelector(searchSelector, search => search.propertyDetails);

export const searchGraphicFilter = createSelector(searchDataSelector, search => search.filter);

