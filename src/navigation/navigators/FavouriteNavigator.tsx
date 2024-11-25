import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import * as Routes from 'src/constants/routes';
import Favourite from 'src/screens/Favourite';
import PropertyDetails from 'src/screens/Search/PropertyDetails';
import PropertyPhotoDetails from 'src/screens/Search/PropertyPhotoDetails';
import Subscription from 'src/screens/Subscription';
import { defaultScreenOpts } from '../Router';

const Stack = createStackNavigator();

const FavouriteNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Routes.Favourite} component={Favourite} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.PropertyDetails} component={PropertyDetails} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.PropertyPhotoDetails} component={PropertyPhotoDetails} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.Subscription} component={Subscription} options={defaultScreenOpts} />
  </Stack.Navigator>
);

export default FavouriteNavigator;
