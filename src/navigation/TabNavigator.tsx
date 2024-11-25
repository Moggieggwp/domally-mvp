import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, Platform, View } from 'react-native';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import * as tabIcons from './navigators/assets';
import ChatNavigator from './navigators/ChatNavigator';
import FavouriteNavigator from './navigators/FavouriteNavigator';
import ProfileNavigator from './navigators/ProfileNavigator';
import PublishNavigator from './navigators/PublishNavigator';
import SearchNavigator from './navigators/SearchNavigator';

const Tab = createBottomTabNavigator();

const defaultOptions = (route, icon, label, changeColorOnFocus) => ({
  tabBarVisible: getTabBarVisibility(route),
  tabBarLabel: ({ focused }) => (focused ? <Text style={styles.tabBarLabel}>{label}</Text> : null),
  tabBarIcon: ({ focused }) => <Image source={icon} style={[styles.tabBarIcon, focused && changeColorOnFocus && styles.focusedTabIcon]} />,
});

const TabRouter = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator tabBarOptions={{ style: styles.tabNavigatorStyle }}>
      <Tab.Screen name={Routes.Search} component={SearchNavigator} options={({ route }) => defaultOptions(route, tabIcons.searchTabIcon, Routes.Search, true)} />
      <Tab.Screen
        name={Routes.Favourite}
        component={FavouriteNavigator}
        options={({ route }) => defaultOptions(route, tabIcons.favouriteTabIcon, Routes.Favourite, true)}
      />
      <Tab.Screen name={Routes.Publish} component={PublishNavigator} options={({ route }) => defaultOptions(route, tabIcons.publishTabIcon, Routes.Publish, false)} />
      <Tab.Screen name={Routes.Inbox} component={ChatNavigator} options={({ route }) => defaultOptions(route, tabIcons.chatTabIcon, 'Chat', true)} />
      <Tab.Screen name={Routes.Profile} component={ProfileNavigator} options={({ route }) => defaultOptions(route, tabIcons.profileTabIcon, Routes.Profile, true)} />
    </Tab.Navigator>
  </View>
);

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? Routes.Search;
  return [Routes.Search, Routes.Favourite, Routes.Publish, Routes.Inbox, Routes.Profile, Routes.PropertiesList].includes(routeName);
};

const styles = StyleSheet.create({
  tabNavigatorStyle: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: Platform.OS === 'ios' ? (Layout.isMediumDevice || Layout.isSmallDevice ? 78 : 100) : 78,
    shadowRadius: 4,
    shadowOpacity: 0.04,
  },
  tabBarLabel: {
    position: 'absolute',
    fontSize: 11,
    color: Colors.primaryBlue,
    fontFamily: 'Gilroy',
    fontWeight: '600',
    bottom: Layout.isMediumDevice ? -10 : 0,
  },
  tabBarIcon: {
    marginTop: 8,
    marginBottom: 10,
  },
  focusedTabIcon: {
    tintColor: Colors.primaryBlue,
  },
});

export default TabRouter;
