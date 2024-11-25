import { NODE_ENV } from '@env';
import analytics from '@react-native-firebase/analytics';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import splashData from 'src/assets/lottie/splash.json';
import Colors from 'src/constants/colors/Colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import { acknowledgePurchase, appIsOpen, getAppMeasureRates, getMinAppVersion, setAppMetrics } from 'src/redux/actions/app';
import { getFavouriteProperties } from 'src/redux/actions/favourites';
import { getMyPropertyChats, getOtherPropertyChats } from 'src/redux/actions/inbox';
import { getNotificationSettings, getPremiumStatus, loadProfile } from 'src/redux/actions/profile';
import { updateSearchData } from 'src/redux/actions/search';
import { getUsersProperties } from 'src/redux/actions/usersProperties';
import { appSelector } from 'src/redux/selectors/app';
import { profileDataSelector } from 'src/redux/selectors/profile';
import TextStyles from 'src/styles/Typography';
import { AppMetrics } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { clearStorage, getIsMainOnboardCompleted, getIsOnboardCompleted, getLocalAccessToken, getLocalSearchData, getMetrics } from 'src/utils/storage';
import packageJson from '../../../package.json';
import compareVersions from 'compare-versions';
import { clearTransactionIOS, Purchase, useIAP, flushFailedPurchasesCachedAsPendingAndroid } from 'react-native-iap';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Splash'>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

const Splash = (props: Props) => {
  const { navigation } = props;

  const profile = useSelector(profileDataSelector);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isOnboardCompleted, setIsOnboardCompleted] = useState('');
  const [isMainOnboardCompleted, setIsMainOnboardCompleted] = useState('');
  const [isSignedIn, setIsSignedIn] = useState('');
  const [localSearchData, setLocalSearchData] = useState('');
  const [appMetrics, setLocalAppMetrics] = useState<AppMetrics>(null);
  const { minAppVersion } = useSelector(appSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    const getLocalStorageData = async () => {
      setIsOnboardCompleted(await getIsOnboardCompleted());
      setIsMainOnboardCompleted(await getIsMainOnboardCompleted());
      setIsSignedIn(await getLocalAccessToken());
      setLocalSearchData(await getLocalSearchData());
      setLocalAppMetrics(await getMetrics());
    };

    getTrackingPermissions();
    getLocalStorageData();
    dispatch(getAppMeasureRates());
    dispatch(getMinAppVersion());
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      loadInitialAuthorizedUserData();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (profile?.id) {
      analytics().setUserId(profile.id.toString());
    }
  }, [profile]);

  useEffect(() => {
    if (appMetrics) {
      dispatch(setAppMetrics(appMetrics));
    }
  }, [appMetrics]);

  const getTrackingPermissions = async () => {
    try {
      const trackingStatus = await requestTrackingPermission();
      if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        analytics().setAnalyticsCollectionEnabled(NODE_ENV === 'prod');
      }
    } catch (error) {
      console.log(`ERROR: ${error} in getTrackingPermissions`)
    }
  };

  const loadInitialAuthorizedUserData = () => {
    dispatch(loadProfile());
    dispatch(getNotificationSettings());
    dispatch(getFavouriteProperties());
    dispatch(getOtherPropertyChats());
    dispatch(getMyPropertyChats());
    dispatch(getUsersProperties(null));
    dispatch(getPremiumStatus());
  };

  const setLocalStorageSearchData = async () => {
    if (!localSearchData) return;
    dispatch(updateSearchData(JSON.parse(localSearchData), false));
  };

  const updateOpeningData = async () => {
    if (!isSignedIn) return;
    await dispatch(appIsOpen());
  };

  const animateText = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: false,
    }).start();
  };

  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current.play();
    animateText();
  }, []);

  const onFinish = () => {
    navigateToNextRoute();
  };

  const navigateToNextRoute = async () => {
    let route: keyof RootStackParamsList;

    // if (compareVersions(packageJson.version.toString(), minAppVersion.toString()) === -1) {
    //   Alert.alert('Your application version is not supported. Please, upgrade application to the latest version.');
    //   return;
    // }

    console.log(isSignedIn, 'AUTH: isSignedIn');
    console.log(isOnboardCompleted, 'AUTH: isOnboardCompleted');
    console.log(isMainOnboardCompleted, 'AUTH: isMainOnboardCompleted');
    console.log(appMetrics, 'APP_METRICS');

    console.log('minAppVersion', minAppVersion);
    console.log('version', packageJson.version);

    if (isSignedIn) {
      route = isMainOnboardCompleted ? (!profile?.firstName || !profile.lastName || !profile.email ? Routes.UserAbout : Routes.Home) : Routes.ChooseGoal;

      await updateOpeningData();
    } else {
      await setLocalStorageSearchData();
      route = isOnboardCompleted ? Routes.SignIn : Routes.Onboarding;
    }

    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <LottieView style={[styles.lottie]} ref={animation} source={splashData} onAnimationFinish={onFinish} loop={false} autoPlay={false} />
      </View>
      <Animated.Text style={[styles.footerText, TextStyles.thinBody, { opacity: fadeAnim }]}>
        A vibrant community that empowers individuals who are working toward the same goal—thriving in the field of real estate
      </Animated.Text>
      <LinearGradient colors={[Colors.splash.gradientColor2, Colors.splash.gradientColor1]} style={styles.gradientBg} locations={[1, 0]} pointerEvents='none' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
    flex: 1,
  },
  lottie: {
    width: 250,
    height: 180,
  },
  logoWrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: Layout.getViewHeight(32),
    width: 223,
    height: 155,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  footerText: {
    width: '90%',
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    zIndex: 2,
    textAlign: 'center',
    opacity: 0,
  },
});

export default Splash;
