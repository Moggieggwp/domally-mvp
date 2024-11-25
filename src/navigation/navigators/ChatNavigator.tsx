import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import * as Routes from 'src/constants/routes';
import { defaultScreenOpts } from '../Router';
import Inbox from 'src/screens/Inbox';
import Chat from 'src/screens/Inbox/Chat/Chat';
import PropertyDetails from 'src/screens/Search/PropertyDetails';
import UserDetails from 'src/screens/Inbox/UserDetails';
import Subscription from 'src/screens/Subscription';

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Inbox} component={Inbox} options={defaultScreenOpts} />
      <Stack.Screen name={Routes.Chat} component={Chat} options={defaultScreenOpts} />
      <Stack.Screen name={Routes.UserDetails} component={UserDetails} options={defaultScreenOpts} />
      <Stack.Screen name={Routes.PropertyDetails} component={PropertyDetails} options={defaultScreenOpts} />
      <Stack.Screen name={Routes.Subscription} component={Subscription} options={defaultScreenOpts} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
