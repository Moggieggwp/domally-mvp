import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Platform, SafeAreaView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CachedImage } from 'react-native-img-cache';
import { useDispatch, useSelector } from 'react-redux';
import Colors from 'src/constants/colors';
import * as Routes from 'src/constants/routes';
import { useBackButtonListener } from 'src/helpers/hooks';
import { removeFcmToken } from 'src/redux/actions/notification';
import { isSignedInSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';
import { logOut } from '../../redux/actions/auth';
import { defaultAvatar, editProfileIcon, faqIcon, logOutIcon, metricsIcon, privacyPolicyIcon, share, signInBanner, supportMenuItem, notificationIcon } from './assets';
import MenuItem from './components/menu-item';

type Props = {
  navigation: BottomTabNavigationProp<RootStackParamsList, 'Profile'>;
};

const Profile = (props: Props) => {
  const { navigation } = props;

  const isSignedIn = useSelector(isSignedInSelector);
  const profile = useSelector(profileDataSelector);

  const dispatch = useDispatch();
  const backListener = useBackButtonListener();

  const handleInvitePress = async () => {
    await Share.share({
      message: 'Hi! You are welcome to try the Domally app, please follow the link to download the latest version of the app',
      url: 'https://domally.page.link/Zi7X',
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.container}>
        {!isSignedIn ? (
          <View style={styles.signInHeaderContainer}>
            <Image source={signInBanner} />
            <View style={styles.signInDescription}>
              <Text style={TextStyles.h2}>Dear guest, please</Text>
              <Text style={[TextStyles.body1, styles.signUpLabelDesctiption]}>Sign in to get access to all domally services.</Text>
              <TouchableOpacity onPress={() => navigation.navigate(Routes.SignIn, { navigationParams: { screen: Routes.Profile } })}>
                <Text style={[TextStyles.body2, styles.signInButton]}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileHeaderContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate(Routes.EditProfile)}>
              <Image source={editProfileIcon} />
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
              {Platform.OS === 'ios' ? (
                profile?.avatar ? (
                  <Image source={{ uri: profile.avatar, cache: 'reload' }} style={styles.avatarStyle} />
                ) : (
                  <Image source={defaultAvatar} />
                )
              ) : profile?.avatar ? (
                <CachedImage source={{ uri: profile.avatar }} mutable style={styles.avatarStyle} />
              ) : (
                <Image source={defaultAvatar} />
              )}
            </View>
            <View style={styles.userInfoHeader}>
              <Text style={TextStyles.cardTitle1}>
                {profile.firstName} {profile.lastName}
              </Text>
              <Text style={styles.userBio}>{profile.bio}</Text>
              <Text style={styles.userBio}>{profile.email}</Text>
            </View>
          </View>
        )}
        <View style={styles.menuItemsContainer}>
          {isSignedIn && <MenuItem icon={notificationIcon} label={'Notifications'} onPress={() => navigation.navigate(Routes.Notifications)} />}
          <MenuItem icon={metricsIcon} label={'Metrics'} onPress={() => navigation.navigate(Routes.Metrics)} />
          {/* <MenuItem icon={share} label={'Share the App'} onPress={() => handleInvitePress()} /> */}
          <MenuItem icon={supportMenuItem} label={'Support'} onPress={() => navigation.navigate(Routes.Support)} />
          {/* <MenuItem icon={faqIcon} label={'FAQ'} onPress={() => navigation.navigate(Routes.FAQ)} /> */}
          <MenuItem icon={privacyPolicyIcon} label={'Privacy policy'} onPress={() => navigation.navigate(Routes.PrivacyPolicy)} />
          <MenuItem icon={privacyPolicyIcon} label={'License agreement'} onPress={() => navigation.navigate(Routes.LicenseAgreement)} />

          {isSignedIn && <MenuItem icon={supportMenuItem} label={'Subscription'} onPress={() => navigation.navigate(Routes.Subscription)} /> }

          {isSignedIn && (
            <MenuItem
              icon={logOutIcon}
              label={'Log Out'}
              style={styles.logOutItem}
              onPress={async () => {
                await dispatch(removeFcmToken());
                dispatch(logOut());
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  signInHeaderContainer: {
    alignItems: 'center',
  },
  signInDescription: {
    marginTop: 16,
    alignItems: 'center',
    width: '80%',
  },
  signUpLabelDesctiption: {
    marginTop: 12,
    textAlign: 'center',
  },
  signInButton: {
    marginTop: 16,
    color: Colors.primaryBlue,
  },
  menuItemsContainer: {
    marginTop: 30,
  },
  menuItemLabel: {
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  profileHeaderContainer: {
    marginBottom: 20,
  },
  editButton: {
    padding: 10,
    marginLeft: 'auto',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  userInfoHeader: {
    alignItems: 'center',
    marginTop: 8,
  },
  userBio: {
    ...TextStyles.body2,
    color: Colors.typography.body2,
    marginTop: 8,
  },
  logOutItem: {
    marginTop: 30,
    paddingBottom: 10,
  },
  avatarStyle: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
});

export default Profile;
