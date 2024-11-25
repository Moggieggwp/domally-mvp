import { createSelector } from 'reselect';
import { IRootState } from 'src/redux/store';
import { IAuthState } from 'src/types';

export const authSelector = (state: IRootState): IAuthState => state.auth;

export const isSignedInSelector = createSelector(authSelector, (auth) => auth.isSignedIn);

export const userPhoneNumberSelector = createSelector(authSelector, (auth) => auth.user?.phone);

export const isNewUserSelector = createSelector(authSelector, (auth) => auth.newUser);

export const loginErrorMessageSelector = createSelector(authSelector, (auth) => auth.loginError?.message);

export const signUpErrorMessageSelector = createSelector(authSelector, (auth) => auth.signUpError?.message);

export const loadingSelector = createSelector(authSelector, (auth) => auth.loading);
