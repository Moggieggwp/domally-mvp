import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import * as Routes from 'src/constants/routes';
import Search from 'src/screens/Search';

import PropertiesList from 'src/screens/Search/PropertiesList';
import PropertyDetails from 'src/screens/Search/PropertyDetails';
import PropertyPhotoDetails from 'src/screens/Search/PropertyPhotoDetails';
import { defaultScreenOpts } from '../Router';
import ChooseLocation from 'src/screens/ChooseLocation';
import SearchFilter from 'src/screens/Search/SearchFilter';
import Subscription from 'src/screens/Subscription';

const Stack = createStackNavigator();

const SearchNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Routes.Search} component={Search} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.SearchFilter} component={SearchFilter} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.PropertyDetails} component={PropertyDetails} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.PropertyPhotoDetails} component={PropertyPhotoDetails} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.PropertiesList} component={PropertiesList} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.ChooseLocation} component={ChooseLocation} options={defaultScreenOpts} />
    <Stack.Screen name={Routes.Subscription} component={Subscription} options={defaultScreenOpts} />
  </Stack.Navigator>
);

export default SearchNavigator;
