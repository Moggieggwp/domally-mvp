import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from 'src/components/stepper/Stepper';
import { Step } from 'src/components/stepper/types';
import * as NavigationService from 'src/services/NavigationService';
import { searchLoadingSelector } from 'src/redux/selectors/search';
import ResidentialType from 'src/screens/SteppersScreens/ResidentialType';
import OnboardingSearchSize from 'src/screens/SteppersScreens/OnboardingSearchSize';
import OnboardingSearchPrice from 'src/screens/SteppersScreens/OnboardingSearchPrice';

import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import { setOnboardingAction } from 'src/redux/actions/app';
import ResidentialDetails from './steps/ResidentialDetails';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'BuyResidentialStepper'>;
};

export default function BuyResidentialStepper(props: Props) {
  const { navigation } = props;

  const stateLoading = useSelector(searchLoadingSelector);
  const dispatch = useDispatch();

  const onFinishStepper = async () => {
    dispatch(setOnboardingAction(null));
    NavigationService.navigate(Routes.Home, {});
  };

  const routes: Step[] = [
    {
      component: ResidentialType,
      onBack: () => navigation.navigate(Routes.ChooseLocation),
    },
    {
      component: ResidentialDetails,
    },
    {
      component: OnboardingSearchSize,
    },
    {
      component: OnboardingSearchPrice,
    },
  ];

  return <Stepper isLoading={stateLoading} initialStep={1} navigation={navigation} routes={routes} onFinish={onFinishStepper} />;
}
