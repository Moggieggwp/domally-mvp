import { createSelector } from 'reselect';
import { IRootState } from 'src/redux/store';
import { IUserPropertiesState } from 'src/types';

export const usersPropertiesSelector = (state: IRootState): IUserPropertiesState => state.usersProperties;

export const properties = createSelector(usersPropertiesSelector, usersProperties => usersProperties.properties);
export const propertyById = (propertyId: number) => createSelector(usersPropertiesSelector, usersProperties => usersProperties.properties?.find(p => p.id === propertyId));
export const loadingSelector = createSelector(usersPropertiesSelector, (usersProperties) => usersProperties.loading);
export const propertiesFilterSelector = createSelector(usersPropertiesSelector, (usersProperties) => usersProperties.propertiesFilter);
