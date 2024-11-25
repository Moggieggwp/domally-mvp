import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from 'src/components/stepper/Stepper';
import { Step } from 'src/components/stepper/types';
import * as Routes from 'src/constants/routes';
import { resetCurrentProperty } from 'src/redux/actions/currentProperty';
import { getUsersProperties } from 'src/redux/actions/usersProperties';
import { currentPropertyLoading } from 'src/redux/selectors/currentProperty';
import AboutProperty from 'src/screens/SteppersScreens/AboutProperty';
import AddressScreen from 'src/screens/SteppersScreens/AddressScreen';
import LandSquare from 'src/screens/SteppersScreens/LandSquare';
import LandType from 'src/screens/SteppersScreens/LandType';
import PropertyPhotos from 'src/screens/SteppersScreens/PropertyPhotos';
import PropertyPrice from 'src/screens/SteppersScreens/PropertyPrice';
import VirtualShowings from 'src/screens/SteppersScreens/VirtualShowings';
import ZoningCode from 'src/screens/SteppersScreens/ZoningCode';
import * as NavigationService from 'src/services/NavigationService';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from 'src/types/navigation';
import { mainOnboardingAction } from 'src/redux/selectors/app';
import { setOnboardingAction } from 'src/redux/actions/app';
import { useBackButtonListener } from 'src/helpers/hooks';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'SellLandStepper'>;
  route: RouteProp<RootStackParamsList, 'SellLandStepper'>;
};

export default function SellLandStepper(props: Props) {
  const { navigation, route } = props;

  const dispatch = useDispatch();
  const stateLoading = useSelector(currentPropertyLoading);
  const isOnboarding = useSelector(mainOnboardingAction);

  const onFinishStepper = async () => {
    dispatch(resetCurrentProperty());
    dispatch(getUsersProperties());

    if (isOnboarding) {
      dispatch(setOnboardingAction(null));
      NavigationService.navigate(Routes.Home, { screen: Routes.Publish });
    } else {
      NavigationService.navigate(Routes.Publish, {});
    }
  };

  const routes: Step[] = [
    {
      component: LandType,
      onBack: !isOnboarding ? () => onFinishStepper() : null,
    },
    {
      component: LandSquare,
    },
    {
      component: VirtualShowings,
    },
    {
      component: AddressScreen,
    },
    {
      component: ZoningCode,
    },
    {
      component: AboutProperty,
    },
    {
      component: PropertyPrice,
    },
    {
      component: PropertyPhotos,
    },
  ];

  return (
    <Stepper
      isLoading={stateLoading}
      onSkip={onFinishStepper}
      onFinish={onFinishStepper}
      finishBtnShowIndex={route?.params?.initialStep ? 1 : 2}
      initialStep={route?.params?.initialStep || 1}
      navigation={navigation}
      routes={routes}
    />
  );
}
