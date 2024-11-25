export interface IAuthData {
  phone: string;
}

export interface IAuthCodeConfirm {
  phone: string;
  code: string;
}

export interface IAuthState {
  user?: {
    accessToken?: string;
    phone: string;
  };
  loginError?: Error;
  signUpError?: Error;
  logOutError?: Error;
  isSignedIn: boolean;
  newUser: boolean;
  loading: boolean;
}
