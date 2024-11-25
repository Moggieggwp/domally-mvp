import { createSelector } from 'reselect';
import { IRootState } from 'src/redux/store';
import { IProfileState } from 'src/types';

export const profileSelector = (state: IRootState): IProfileState => state.profile;

export const loadingSelector = createSelector(profileSelector, (profile) => profile.loading);
export const profileDataSelector = createSelector(profileSelector, (profile) => profile.data);
export const isSignedInSelector = createSelector(profileSelector, (profile) => profile.isSignedIn);
export const faqSettingsSelector = createSelector(profileSelector, (profile) => profile.faqSettings);
export const notificationSettingsSelector = createSelector(profileSelector, (profile) => profile.notificationSettings);
export const premiumInfoSelector = createSelector(profileSelector, (profile) => profile.premiumInfo);
export const isPremiumSelector = createSelector(profileSelector, (profile) => profile.premiumInfo?.status === 'active');