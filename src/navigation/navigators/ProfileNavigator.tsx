import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import * as Routes from 'src/constants/routes';
import Profile from 'src/screens/Profile';
import EditProfile from 'src/screens/Profile/EditProfile';
import FAQ from 'src/screens/Profile/Faq';
import FaqDetails from 'src/screens/Profile/Faq/FaqDetails';
import LicenseAgreement from 'src/screens/Profile/LicenseAgreement';
import Metrics from 'src/screens/Profile/Metrics';
import Notifications from 'src/screens/Profile/Notifications';
import PrivacyPolicy from 'src/screens/Profile/PrivacyPolicy';
import Support from 'src/screens/Profile/Support';
import Subscription from 'src/screens/Subscription';
import { defaultScreenOpts } from '../Router';

const Stack = createStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Routes.Profile} component={Profile} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.EditProfile} component={EditProfile} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.Support} component={Support} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.Metrics} component={Metrics} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.PrivacyPolicy} component={PrivacyPolicy} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.FAQ} component={FAQ} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.FaqDetails} component={FaqDetails} options={defaultScreenOpts} initialParams={{ faqItem: {} }} />
    <Stack.Screen name={Routes.Notifications} component={Notifications} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.LicenseAgreement} component={LicenseAgreement} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.Subscription} component={Subscription} options={defaultScreenOpts} />

  </Stack.Navigator>
);

export default ProfileNavigator;
