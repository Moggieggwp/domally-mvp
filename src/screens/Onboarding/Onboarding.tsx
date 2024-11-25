import React, { useEffect, useState, useMemo } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from 'src/types/navigation';
import { StyleSheet, Text, View, Animated, Image, Platform } from 'react-native';
import { Container, Logo, Button, ProgressBar, TextButton } from 'src/components';
import TextStyles from 'src/styles/Typography';
import Colors from 'src/constants/colors';
import BaseStyles from 'src/styles/BaseStyles';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import { OnboardingTab, getTabById } from 'src/constants/OnboardingTabs';
import { setOnboardingCompleted } from 'src/utils/storage';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
};

export default function OnboardingScreen(props: Props) {
  const { navigation } = props;

  const totalCount = 3;
  const [stepIndex, setStepIndex] = useState(1);
  const [busy, setBusy] = useState(false);

  const opacity = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const nextStep = async () => {
    if (busy) return;

    setBusy(true);
    Animated.timing(opacity, {
      toValue: 0,
      duration: 750,
      useNativeDriver: true,
    }).start(
      () => {
        setStepIndex(stepIndex + 1);
        setBusy(false);
      }
    );

    if (stepIndex === totalCount) {
      getNextRoute();
    }
  };

  const getNextRoute = async () => {
    await setOnboardingCompleted();
    navigation.navigate(Routes.SignIn);
  };

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }).start();
  }, [stepIndex]);

  const renderStep = (tab: OnboardingTab) => {
    if (!tab) return null;

    return (
      <>
        <Text style={[TextStyles.h1, styles.slideTitle]}>{tab.title}</Text>
        <Text style={[TextStyles.body1, styles.slideDesc]}>{tab.desc}</Text>
      </>
    );
  };

  const renderImage = (tab: OnboardingTab) => {
    if (!tab) return null;

    return <Image source={tab.imgUrl} style={[styles.bg]} />;
  };

  const isLastStep = stepIndex === totalCount;
  const activeTab = getTabById(stepIndex);

  return (
    <View style={styles.mainContainer}>
      {!isLastStep && (
        <TextButton
          onPress={() => getNextRoute()}
          containerStyle={styles.skipBtn}
          titleStyle={[TextStyles.btnTitle, { color: Colors.button.ghostBtnColor }]}
          title='Skip'
        />
      )}
      <Animated.View style={[styles.bgContainer, { opacity: opacity }]}>
        {renderImage(activeTab)}
        <Logo style={styles.logo} hasLabel />
      </Animated.View>
      <Container>
        <Animated.View style={[BaseStyles.flexCenter, styles.content, { opacity: opacity }]}>
          <View style={styles.textBlock}>{renderStep(activeTab)}</View>
        </Animated.View>
      </Container>
      <Container style={styles.btnWrap}>
        <Button
          onPress={nextStep}
          style={styles.btn}
          title={!isLastStep ? 'Next' : 'Start'}
          hasArrow={!isLastStep}
        />
        <ProgressBar progress={stepIndex / totalCount} progressWidth={0} />
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
  },
  bgContainer: {
    position: 'relative',
    width: '100%',
    height: Layout.isMediumDevice ? Layout.getViewHeight(50) : Layout.getViewHeight(53.3), 
  },
  bg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    overflow: 'visible',
    top: 0,
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? Layout.getViewHeight(8) : 16,
  },
  content: {
    width: '100%',
    maxHeight: 156,
    marginTop: Platform.OS === 'ios' ? 
      (Layout.isMediumDevice ? 20 : 60)
       : '20%',
  },
  textBlock: {
    width: '100%',
  },
  btnWrap: {
    width: '100%',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 63 : 25,
    alignSelf: 'center',
  },
  btn: {
    marginBottom: 26,
  },
  skipBtn: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? Layout.getViewHeight(8) + 5 : 21,
    zIndex: 20,
    alignSelf: 'flex-start',
    width: 'auto',
  },
  slideTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDesc: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 22,
  },
});
