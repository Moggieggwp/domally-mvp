import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from 'src/types/navigation';
import CommercialPropertyType from 'src/screens/SteppersScreens/CommercialType';
import * as NavigationService from 'src/services/NavigationService';
import { Step } from 'src/components/stepper/types';
import * as Routes from 'src/constants/routes';
import Stepper from 'src/components/stepper/Stepper';
import OnboardingSearchSize from 'src/screens/SteppersScreens/OnboardingSearchSize';
import OnboardingSearchPrice from 'src/screens/SteppersScreens/OnboardingSearchPrice';
import { useDispatch, useSelector } from 'react-redux';
import { searchLoadingSelector } from 'src/redux/selectors/search';
import { setOnboardingAction } from 'src/redux/actions/app';
import CommercialDetails from './steps/CommercialDetails';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'BuyCommercialStepper'>;
};

export default function BuyCommercialStepper(props: Props) {
  const { navigation } = props;

  const stateLoading = useSelector(searchLoadingSelector);
  const dispatch = useDispatch();

  const onFinishStepper = async () => {
    dispatch(setOnboardingAction(null));
    NavigationService.navigate(Routes.Home, {});
  };

  const routes: Step[] = [
    {
      component: CommercialPropertyType,
      onBack: () => navigation.navigate(Routes.ChooseLocation),
    },
    {
      component: CommercialDetails,
    },
    {
      component: OnboardingSearchSize,
    },
    {
      component: OnboardingSearchPrice,
    },
  ];

  return <Stepper initialStep={1} navigation={navigation} routes={routes} onFinish={onFinishStepper} isLoading={stateLoading} />;
}
