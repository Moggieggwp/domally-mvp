import { createSelector } from 'reselect';
import { IRootState } from 'src/redux/store';
import { IFavouritesState } from 'src/types';

export const favouritesSelector = (state: IRootState): IFavouritesState => state.favourites;

export const loadingSelector = createSelector(favouritesSelector, (favourites) => favourites.loading);
export const favouritePropertiesSelector = createSelector(favouritesSelector, (favourites) => favourites.favouriteProperties);
export const unlikedFavouritesSelector = createSelector(favouritesSelector, (favourites) => favourites.unlikedFavourites);
