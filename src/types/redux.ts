import { LocationOption } from 'src/constants/search/LocationOptions';
import { Action, AppMetrics } from './common';
import { SearchData } from './search';
import { FavouriteProperty, MeasureRates, Property, PropertyStatus } from '.';
import { IMessage } from 'react-native-gifted-chat';

export interface IAppState {
  popularLocations: LocationOption[];
  onboardingAction: Action;
  loading: boolean;
  error: object;
  popupsToShow: string[];
  metrics: AppMetrics;
  measureRates: MeasureRates;
  minAppVersion: string;
}

export interface IProfileState {
  data: {
    id: number,
    phone: string,
    avatar: string,
    lastName: string,
    firstName: string,
    email: string,
    bio: string,
    isPhoneNumberDisabled: boolean,
    search: object,
  };
  isSignedIn: boolean,
  loading: boolean,
  error: object,
  faqSettings: FaqSettingsType[];
  notificationSettings: {
    isChatNotificationEnabled: boolean,
    isNewPropertyNotificationEnabled: boolean,
    isChatClaimNotificationEnabled: boolean,
    isPropertyClaimNotificationEnabled: boolean,
    isScheduleTourNotificationEnabled: boolean,
  },
  premiumInfo: {
    productId: string,
    status: string,
    purchaseToken: string,
  }
};

export interface IUserPropertiesState {
  loading: boolean,
  error: object,
  properties: Property[];
  propertiesFilter: PropertyStatus;
  likedProperties: number[];
};

export interface IFavouritesState {
  loading: boolean,
  error: object,
  favouriteProperties: FavouriteProperty[];
  unlikedFavourites: number[];
};

export type FaqSettingsType = {
  label: string;
  imageUrl: string,
  desciption: string;
  minsToRead: number;
}

export type SignInType = {
  isChangingPhoneNumber?: boolean;
  navigationParams?: any;
}

export interface IAction<T> {
  type: string;
  payload: T;
}

export type SearchActionType = {
  type: string | symbol | number;
  payload?: any;
  error?: any;
};

export type CurrentPropertyActionType = {
  type: string | symbol | number;
  payload?: Property;
  error?: any;
};

export type SearchRanges = {
  maxPrice: string;
  maxSize: string;
  minPrice: string;
  minSize: string;
};

export interface ISearchState {
  searchData: SearchData,
  loading: boolean,
  searchResult: Property[],
  searchResultMap: Property[],
  searchResultCount: number,
  searchResultRanges: SearchRanges,
  propertyUserProfile: {
    id: number,
    phone: string,
    avatar: string,
    lastName: string,
    firstName: string,
    email: string,
    bio: string,
    isPhoneNumberDisabled: boolean,
  },
  propertyDetails: Property,
}

export interface IInboxState {
  loading: boolean,
  loadingMessages: boolean,
  error?: any,
  chats: any,
  currentChat: any,
  messages: IMessage[],
  pendingMessages: IMessage[],
}

export interface ICurrentPropertyState extends Property {
  loading: boolean;
  error: any;
}

export type EditPropertyProps = {
  initialStep?: number;
};

export type UserDetailsType = {
  userId: number;
};

export type PropertyDetailsType = {
  propertyId: number;
  userId?: number;
  scheduleTour?: boolean;
  onGoBack?: () => void;
};
