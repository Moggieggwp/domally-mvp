import { createSelector } from 'reselect';
import { IRootState } from 'src/redux/store';
import { IAppState } from 'src/types';

export const appSelector = (state: IRootState): IAppState => state.app;

export const loadingSelector = createSelector(appSelector, app => app.loading);

export const popularLocations = createSelector(appSelector, app => app.popularLocations);

export const mainOnboardingAction = createSelector(appSelector, app => app.onboardingAction);

export const isOnboardingBuyFlow = createSelector(appSelector, app => app.onboardingAction === 'Buy' || app.onboardingAction === 'Rent');

export const popupsSelector = createSelector(appSelector, app => app.popupsToShow);

export const isWhoAreYouPopupVisibleSelector = createSelector(appSelector, app => app.popupsToShow?.includes('WhoAreYou'));

export const metricsSelector = createSelector(appSelector, app => app.metrics);