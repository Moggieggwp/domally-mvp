import { createSelector } from 'reselect';
import { IRootState } from 'src/redux/store';
import { ICurrentPropertyState } from 'src/types';

export const currentPropertySelector = (state: IRootState): ICurrentPropertyState => state.currentProperty;

export const currentPropertyId = createSelector(currentPropertySelector, currentProperty => currentProperty.id);

export const currentPropertyLocation = createSelector(currentPropertySelector, currentProperty => currentProperty.location);

export const currentPropertyLoading = createSelector(currentPropertySelector, currentProperty => currentProperty.loading);

export const currentPropertyAction = createSelector(currentPropertySelector, currentProperty => currentProperty.action);

export const isNewProperty = createSelector(currentPropertySelector, currentProperty => !currentProperty.id);

export const currentPropertyType = createSelector(currentPropertySelector, currentProperty => currentProperty.type);

export const currentPropertyDetailedType = createSelector(currentPropertySelector, currentProperty => currentProperty.detailedType);

export const currentPropertySize = createSelector(currentPropertySelector, currentProperty => currentProperty.size);

export const currentPropertySquare = createSelector(currentPropertySelector, currentProperty => currentProperty.squareDetails);

export const currentPropertyResidentialDetails = createSelector(currentPropertySelector, currentProperty => currentProperty.residentialData);

export const currentPropertyCommercialDetails = createSelector(currentPropertySelector, currentProperty => currentProperty.commercialData);

export const currentPropertyLandDetails = createSelector(currentPropertySelector, currentProperty => currentProperty.landData);

export const currentPropertyIndustrialDetails = createSelector(currentPropertySelector, currentProperty => currentProperty.industrialData);

export const currentPropertyVirtualShowings = createSelector(currentPropertySelector, currentProperty => currentProperty.virtualShowings);

export const currentPropertyPrice = createSelector(currentPropertySelector, currentProperty => currentProperty.price);

export const currentPropertyZoningCode = createSelector(currentPropertySelector, currentProperty => currentProperty.zoningCode);

export const currentPropertyDescription = createSelector(currentPropertySelector, currentProperty => currentProperty.description);

export const currentPropertyPhotos = createSelector(currentPropertySelector, currentProperty => currentProperty.photos);

export const currentPropertyDefaultPhoto = createSelector(currentPropertySelector, currentProperty => currentProperty.defaultPhoto);