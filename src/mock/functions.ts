import { IAuthData, IAuthState, IUser } from 'src/types';

export const actionAsync = (timeout) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const actionUserSignUpAsync = (data: IAuthData) => {
  const res = {
    user: {
      id: '322343243',
      phoneNumber: data.phone,
    },
    accessToken: '32432432eadea',
  };

  return new Promise<any>((resolve) => {
    setTimeout(() => resolve(res), 3000);
  });
};
