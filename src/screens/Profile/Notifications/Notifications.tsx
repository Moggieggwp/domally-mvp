import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header, Preloader, SwitchToggle } from 'src/components';
import Colors from 'src/constants/colors';
import { getNotificationSettings, updateNotificationSettings } from 'src/redux/actions/profile';
import { loadingSelector, notificationSettingsSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import Typography from 'src/styles/Typography';
import { RootStackParamsList } from 'src/types/navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'Notifications'>;
};

const Notifications = (props: Props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  var notificationSettings = useSelector(notificationSettingsSelector);
  const isLoading = useSelector(loadingSelector);

  const [notifyAboutNewProperty, setNotifyAboutNewProperty] = useState(true);
  const [notifyAboutChatMessage, setNotifyAboutChatMessage] = useState(true);
  const [notifyAboutChatClaim, setNotifyAboutChatClaim] = useState(true);
  const [notifyAboutPropertyClaim, setNotifyAboutPropertyClaim] = useState(true);
  const [notifyAboutScheduleTour, setNotifyAboutScheduleTour] = useState(true);

  useEffect(() => {
    dispatch(getNotificationSettings());
  }, []);

  useEffect(() => {
    setNotifyAboutNewProperty(
      notificationSettings === null || !notificationSettings.hasOwnProperty('isNewPropertyNotificationEnabled')
        ? true
        : notificationSettings.isNewPropertyNotificationEnabled,
    );
    setNotifyAboutChatMessage(
      notificationSettings === null || !notificationSettings.hasOwnProperty('isChatNotificationEnabled') ? true : notificationSettings.isChatNotificationEnabled,
    );
    setNotifyAboutChatClaim(
      notificationSettings === null || !notificationSettings.hasOwnProperty('isChatClaimNotificationEnabled') ? true : notificationSettings.isChatClaimNotificationEnabled,
    );
    setNotifyAboutPropertyClaim(
      notificationSettings === null || !notificationSettings.hasOwnProperty('isPropertyClaimNotificationEnabled') ? true : notificationSettings.isPropertyClaimNotificationEnabled,
    );
    setNotifyAboutScheduleTour(
      notificationSettings === null || !notificationSettings.hasOwnProperty('isScheduleTourNotificationEnabled') ? true : notificationSettings.isScheduleTourNotificationEnabled,
    );
  }, [notificationSettings]);

  return (
    <>
      {isLoading && <Preloader />}
      <Header title={'Notifications'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <View style={styles.toggleContainerMargin}>
            <View style={styles.toggleContainer}>
              <SwitchToggle
                enabled={notifyAboutNewProperty}
                title={'Someone adds properties in the area'}
                onChange={(value) => dispatch(updateNotificationSettings({ isNewPropertyNotificationEnabled: value }))}
                titleStyle={styles.switchTitle}
              />
            </View>
            <View style={styles.toggleContainer}>
              <SwitchToggle
                enabled={notifyAboutChatMessage}
                title={'Notify about chat messages'}
                onChange={(value) => dispatch(updateNotificationSettings({ isChatNotificationEnabled: value }))}
                titleStyle={styles.switchTitle}
              />
            </View>
            <View style={styles.toggleContainer}>
              <SwitchToggle
                enabled={notifyAboutChatClaim}
                title={'Notify about chat claims'}
                onChange={(value) => dispatch(updateNotificationSettings({ isChatClaimNotificationEnabled: value }))}
                titleStyle={styles.switchTitle}
              />
            </View>
            <View style={styles.toggleContainer}>
              <SwitchToggle
                enabled={notifyAboutPropertyClaim}
                title={'Notify about property claims'}
                onChange={(value) => dispatch(updateNotificationSettings({ isPropertyClaimNotificationEnabled: value }))}
                titleStyle={styles.switchTitle}
              />
            </View>
            <View style={styles.toggleContainer}>
              <SwitchToggle
                enabled={notifyAboutScheduleTour}
                title={'Notify about schedule tour'}
                onChange={(value) => dispatch(updateNotificationSettings({ isScheduleTourNotificationEnabled: value }))}
                titleStyle={styles.switchTitle}
              />
            </View>
          </View>
        </Container>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  label: {
    ...Typography.body2,
    color: Colors.black,
  },
  toggleContainerMargin: {
    marginTop: 32,
  },
  switchTitle: {
    ...TextStyles.body2,
    color: Colors.primaryBlack,
    textTransform: 'none',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 21,
  },
});

export default Notifications;
