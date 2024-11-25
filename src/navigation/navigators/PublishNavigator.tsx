import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import * as Routes from 'src/constants/routes';
import Publish from 'src/screens/Publish';
import CreatePropertyGoal from 'src/screens/Publish/CreatePropertyGoal';
import { defaultScreenOpts } from '../Router';
import ChooseLocation from 'src/screens/ChooseLocation';
import ChoosePropertyType from 'src/screens/ChoosePropertyType';
import SellResidentialStepper from 'src/screens/CreateProperty/residential/SellResidentialStepper';
import SellLandStepper from 'src/screens/CreateProperty/land/SellLandStepper';
import SellCommercialStepper from 'src/screens/CreateProperty/commercial/SellCommercialStepper';
import SellIndustrialStepper from 'src/screens/CreateProperty/industrial/SellIndustrialStepper';
import UsersPropertyOnMap from 'src/screens/Publish/UsersPropertyOnMap';
import PropertyDetails from 'src/screens/Search/PropertyDetails';
import PropertyPhotoDetails from 'src/screens/Search/PropertyPhotoDetails';
import Subscription from 'src/screens/Subscription';

const Stack = createStackNavigator();

const PublishNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Routes.Publish} component={Publish} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.CreatePropertyGoal} component={CreatePropertyGoal} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.ChoosePropertyType} component={ChoosePropertyType} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.ChooseLocation} component={ChooseLocation} options={defaultScreenOpts} />

    <Stack.Screen name={Routes.SellResidentialStepper} component={SellResidentialStepper} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.SellLandStepper} component={SellLandStepper} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.SellCommercialStepper} component={SellCommercialStepper} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.SellIndustrialStepper} component={SellIndustrialStepper} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.UsersPropertyOnMap} component={UsersPropertyOnMap} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.PropertyDetails} component={PropertyDetails} options={defaultScreenOpts} /> 
    <Stack.Screen name={Routes.PropertyPhotoDetails} component={PropertyPhotoDetails} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.Subscription} component={Subscription} options={defaultScreenOpts} />
  </Stack.Navigator>
)

export default PublishNavigator;
