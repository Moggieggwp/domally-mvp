import * as Routes from 'src/constants/routes';
import { Property } from './property';
import { FaqSettingsType, SignInType, EditPropertyProps, UserDetailsType, PropertyDetailsType } from './redux';

export type RootStackParamsList = {
  [Routes.Splash]: undefined;
  [Routes.Onboarding]: undefined;
  [Routes.SignIn]: SignInType;
  [Routes.PhoneSignIn]: SignInType;
  [Routes.ConfirmationCode]: SignInType;
  [Routes.ChangePhoneNumberSuccess]: undefined;

  [Routes.ChooseGoal]: undefined;
  [Routes.ChoosePropertyType]: undefined;
  [Routes.ChooseLocation]: ChooseLocationType;

  [Routes.BuyResidentialStepper]: undefined;
  [Routes.BuyLandStepper]: undefined;
  [Routes.BuyCommercialStepper]: undefined;
  [Routes.BuyIndustrialStepper]: undefined;

  [Routes.SellResidentialStepper]: EditPropertyProps;
  [Routes.SellLandStepper]: EditPropertyProps;
  [Routes.SellCommercialStepper]: EditPropertyProps;
  [Routes.SellIndustrialStepper]: EditPropertyProps;
  [Routes.CreatePropertyGoal]: undefined;
  [Routes.UsersPropertyOnMap]: undefined;
  [Routes.Notifications]: undefined;

  [Routes.Home]: undefined;

  [Routes.Search]: undefined;
  [Routes.PropertyDetails]: PropertyDetailsType;
  [Routes.PropertyPhotoDetails]: undefined;
  [Routes.PropertiesList]: undefined;
  [Routes.SearchFilter]: undefined;

  [Routes.Inbox]: undefined;
  [Routes.Chat]: PropertyDetailsType;
  [Routes.UserDetails]: UserDetailsType;

  [Routes.Favourite]: undefined;
  [Routes.Publish]: undefined;
  [Routes.Profile]: undefined;
  [Routes.EditProfile]: undefined;
  [Routes.Support]: undefined;
  [Routes.Metrics]: undefined;
  [Routes.PrivacyPolicy]: undefined;
  [Routes.FAQ]: undefined;
  [Routes.FaqDetails]: FaqSettingsType;
  [Routes.LicenseAgreement]: undefined;
  [Routes.UserAbout]: undefined;

  [Routes.Subscription]: undefined;
};

type ChooseLocationType = {
  onBack?: () => void;
  isSingleSearchMode?: boolean;
  onSubmit?: () => void;
};
