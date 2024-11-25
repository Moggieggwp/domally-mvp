import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from 'src/types/navigation';
import { Step } from 'src/components/stepper/types';
import * as Routes from 'src/constants/routes';
import Stepper from 'src/components/stepper/Stepper';
import * as NavigationService from 'src/services/NavigationService';
import LandType from 'src/screens/SteppersScreens/LandType';
import OnboardingSearchSize from 'src/screens/SteppersScreens/OnboardingSearchSize';
import OnboardingSearchPrice from 'src/screens/SteppersScreens/OnboardingSearchPrice';
import { useDispatch, useSelector } from 'react-redux';
import { searchLoadingSelector } from 'src/redux/selectors/search';
import { setOnboardingAction } from 'src/redux/actions/app';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'BuyLandStepper'>;
};

export default function BuyLandStepper(props: Props) {
  const { navigation } = props;

  const stateLoading = useSelector(searchLoadingSelector);
  const dispatch = useDispatch();

  const onFinishStepper = async () => {
    dispatch(setOnboardingAction(null));
    NavigationService.navigate(Routes.Home, {});
  };

  const routes: Step[] = [
    {
      component: LandType,
      onBack: () => navigation.navigate(Routes.ChooseLocation),
    },
    {
      component: OnboardingSearchSize,
    },
    {
      component: OnboardingSearchPrice,
    },
  ];

  return (
    <Stepper
      initialStep={1}
      navigation={navigation}
      routes={routes}
      onFinish={onFinishStepper}
      isLoading={stateLoading}
    />
  );
}
