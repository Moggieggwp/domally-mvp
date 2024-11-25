import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Splash from 'src/screens/Splash';
import Onboarding from 'src/screens/Onboarding';

import SignIn from 'src/screens/AuthScreens/SignIn';
import PhoneSignIn from 'src/screens/AuthScreens/PhoneSignIn';
import ConfirmationCode from 'src/screens/AuthScreens/ConfirmationCode';
import ChangePhoneNumberSuccess from 'src/screens/AuthScreens/ChangePhoneNumberSucces';

import ChooseGoal from 'src/screens/ChooseGoal';
import ChoosePropertyType from 'src/screens/ChoosePropertyType';
import ChooseLocation from 'src/screens/ChooseLocation';

import BuyLandStepper from 'src/screens/MainOnboarding/buy-flow/land/BuyLandStepper';
import BuyResidentialStepper from 'src/screens/MainOnboarding/buy-flow/residential/BuyResidentialStepper';
import BuyCommercialStepper from 'src/screens/MainOnboarding/buy-flow/commercial/BuyCommercialStepper';
import BuyIndustrialStepper from 'src/screens/MainOnboarding/buy-flow/industrial/BuyIndustrialStepper';

import * as Routes from 'src/constants/routes';
import BottomTabNavigator from './TabNavigator';
import SellResidentialStepper from 'src/screens/CreateProperty/residential/SellResidentialStepper';
import SellLandStepper from 'src/screens/CreateProperty/land/SellLandStepper';
import SellIndustrialStepper from 'src/screens/CreateProperty/industrial/SellIndustrialStepper';
import SellCommercialStepper from 'src/screens/CreateProperty/commercial/SellCommercialStepper';
import Chat from 'src/screens/Inbox/Chat/Chat';
import SearchFilter from 'src/screens/Search/SearchFilter';
import UserAbout from 'src/screens/Profile/EditProfile/UserAbout';
import Subscription from 'src/screens/Subscription';

const RootStack = createStackNavigator();

export const defaultScreenOpts = {
  headerStyle: { height: 0 },
  animationEnabled: false,
  headerShown: false,
};

export default function Router({ initialRoute }) {
  return (
    <>
      <RootStack.Navigator initialRouteName={initialRoute}>
        <RootStack.Screen name={Routes.Splash} component={Splash} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.Onboarding} component={Onboarding} options={defaultScreenOpts} />

        <RootStack.Screen name={Routes.SignIn} component={SignIn} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.PhoneSignIn} component={PhoneSignIn} options={defaultScreenOpts} initialParams={{ isChangingPhoneNumber: false }} />
        <RootStack.Screen name={Routes.ConfirmationCode} component={ConfirmationCode} options={defaultScreenOpts} initialParams={{ isChangingPhoneNumber: false }} />
        <RootStack.Screen name={Routes.ChangePhoneNumberSuccess} component={ChangePhoneNumberSuccess} options={defaultScreenOpts} />

        {/* Onboarding main start */}
        <RootStack.Screen name={Routes.ChooseGoal} component={ChooseGoal} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.ChoosePropertyType} component={ChoosePropertyType} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.ChooseLocation} component={ChooseLocation} options={defaultScreenOpts} />

        {/* buy property flow */}
        <RootStack.Screen name={Routes.BuyLandStepper} component={BuyLandStepper} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.BuyResidentialStepper} component={BuyResidentialStepper} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.BuyCommercialStepper} component={BuyCommercialStepper} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.BuyIndustrialStepper} component={BuyIndustrialStepper} options={defaultScreenOpts} />

        {/* sell property flow */}
        <RootStack.Screen name={Routes.SellResidentialStepper} component={SellResidentialStepper} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.SellLandStepper} component={SellLandStepper} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.SellCommercialStepper} component={SellCommercialStepper} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.SellIndustrialStepper} component={SellIndustrialStepper} options={defaultScreenOpts} />
        {/* Onboarding main end*/}

        <RootStack.Screen name={Routes.Chat} component={Chat} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.Home} component={BottomTabNavigator} options={defaultScreenOpts} />
        <RootStack.Screen name={Routes.UserAbout} component={UserAbout} options={defaultScreenOpts} />
      </RootStack.Navigator>
    </>
  );
}
