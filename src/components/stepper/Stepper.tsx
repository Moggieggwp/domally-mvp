import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, BackHandler } from 'react-native';
import Colors from 'src/constants/colors';
import { RootStackParamsList } from 'src/types/navigation';
import Preloader from '../Preloader';
import StepHeader from './StepHeader';
import { Step } from './types';
import * as Routes from 'src/constants/routes';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  routes: Step[];
  initialStep: number;
  navigation: StackNavigationProp<RootStackParamsList>;
  finishBtnShowIndex?: number;
  isLoading?: boolean;
  onSkip?: () => void;
  onFinish?: () => void;
};

const Stepper = (props: Props) => {
  const { routes, initialStep = 1, navigation, isLoading, finishBtnShowIndex = 3, onFinish } = props;

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStep] = useState(1);

  const currentStep: Step = steps[currentStepIndex - 1];

  useEffect(() => {
    setSteps([...routes]);
    setCurrentStep(initialStep);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const onBackPress = () => {
        prev();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [currentStepIndex]),
  );

  const prev = () => {
    if (currentStep?.onBack) {
      currentStep.onBack();
    }

    if (currentStepIndex <= 1) {
      return;
    }

    setCurrentStep(currentStepIndex - 1);
  };

  const next = async () => {
    if (currentStepIndex === steps.length) {
      await onFinish?.();
      return;
    }

    setCurrentStep(currentStepIndex + 1);
  };

  if (!currentStep) {
    return null;
  }

  const RenderComponent = currentStep.component;
  const showFinisBtn = currentStepIndex >= finishBtnShowIndex;
  const onBackHandler = (currentStepIndex <= 1 && !currentStep?.onBack) ? null : prev;

  return (
    <>
      {isLoading && <Preloader />}
      <View style={styles.container}>
        <StepHeader
          onFinish={showFinisBtn && props?.onSkip}
          onBack={onBackHandler} stepsLength={steps.length}
          currentStepIndex={currentStepIndex}
        />
        <View style={styles.stepContainer}>
          <RenderComponent navigation={navigation} onNext={next} />
        </View>
      </View>
    </>
  );
};

export default Stepper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  stepContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
});
