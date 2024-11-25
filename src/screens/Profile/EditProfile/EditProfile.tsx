import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import { BottomSheet, Container, Header, Preloader, Switch } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { removeAccount, updateUser, uploadAvatar } from 'src/redux/actions/profile';
import { loadingSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';
import { emailRegex } from 'src/utils/validation';
import { defaultAvatar, trashIcon } from '../assets';
import MenuItem from '../components/menu-item';
import InputRow from './components/InputRow';
import * as Routes from 'src/constants/routes';
import { ScrollView } from 'react-native-gesture-handler';
import { removeFcmToken } from 'src/redux/actions/notification';
import { checkAndroidPermissionsMultiple } from 'src/utils/androidPermissionsHelper';
import { CachedImage } from 'react-native-img-cache';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'EditProfile'>;
};

const EditProfile = (props: Props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const userInfo = useSelector(profileDataSelector);
  const isLoading = useSelector(loadingSelector);

  const [firstName, setFirstName] = useState(userInfo?.firstName);
  const [lastName, setLastName] = useState(userInfo?.lastName);
  const [emailAddress, setEmailAddress] = useState(userInfo?.email);
  const [isPhoneNumberDisabled, setIsPhoneNumberDisabled] = useState(userInfo?.isPhoneNumberDisabled);
  const [bio, setBio] = useState(userInfo?.bio);
  const [showRemoveAccountPopup, setShowRemoveAccountPopup] = useState(false);
  const [showUploadAvatarSheet, setShowUploadAvatarSheet] = useState(false);
  const [showChangePhoneNumberSheet, setShowChangePhoneNumberSheet] = useState(false);
  const [avatar, setAvatar] = React.useState<string>('');

  const removeAccountSheetRef = useRef<BottomSheetContainer>(null);
  const uploadAvatarSheetRef = useRef<BottomSheetContainer>(null);
  const changePhoneNumberSheetRef = useRef<BottomSheetContainer>(null);

  const updateUserData = useCallback(
    (field, value) => {
      const user = {};
      user[field] = value;
      dispatch(updateUser(user));
    },
    [dispatch],
  );

  const onRemovePress = useCallback(() => {
    setShowRemoveAccountPopup(true);
    removeAccountSheetRef.current.snapTo(0);
  }, [showRemoveAccountPopup]);

  const onUploadAvatarPress = useCallback(async () => {
    if (Platform.OS === 'android') {
      await checkAndroidPermissionsMultiple();
    }
    setShowUploadAvatarSheet(true);
    uploadAvatarSheetRef.current.snapTo(0);
  }, [showUploadAvatarSheet]);

  const onChangePhoneNumberPress = useCallback(() => {
    setShowChangePhoneNumberSheet(true);
    changePhoneNumberSheetRef.current.snapTo(0);
  }, [showChangePhoneNumberSheet]);

  const handleUploadPhotoPress = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, maxHeight: 512, maxWidth: 512 }, (response) => {
      hideUploadAvatarSheet();
      if (!response.errorCode && !response.didCancel) {
        dispatch(uploadAvatar(response.assets[0].uri));
      }
    });
  };

  const handleTakePhotoPress = () => {
    launchCamera({ mediaType: 'photo', maxHeight: 512, maxWidth: 512 }, (response) => {
      hideUploadAvatarSheet();
      if (!response.errorCode && !response.didCancel) {
        dispatch(uploadAvatar(response.assets[0].uri));
      }
    });
  };

  const hideRemoveAccountSheet = () => {
    setShowRemoveAccountPopup(false);
    removeAccountSheetRef.current.snapTo(1);
  };

  const hideUploadAvatarSheet = () => {
    setShowUploadAvatarSheet(false);
    uploadAvatarSheetRef.current.snapTo(1);
  };

  const hideChangePhoneNumberSheet = () => {
    setShowChangePhoneNumberSheet(false);
    changePhoneNumberSheetRef.current.snapTo(1);
  };

  return (
    <>
      {isLoading && <Preloader />}
      <Header title={'Edit profile Information'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Container style={styles.container}>
            <View>
              <View style={styles.profileHeaderContainer}>
                <View style={styles.avatarContainer}>
                  {Platform.OS === 'ios' ? (
                    userInfo?.avatar ? (
                      <Image source={{ uri: userInfo.avatar }} style={styles.avatarStyle} />
                    ) : (
                      <Image source={defaultAvatar} />
                    )
                  ) : userInfo?.avatar ? (
                    <CachedImage source={{ uri: userInfo.avatar }} mutable style={styles.avatarStyle} />
                  ) : (
                    <Image source={defaultAvatar} />
                  )}
                </View>
                <TouchableOpacity onPress={onUploadAvatarPress}>
                  <Text style={[TextStyles.body2, styles.uploadAvatarButton]}>Upload Profile Image</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.menuItemsContainer}>
                <InputRow
                  title={'First name'}
                  name={'firstName'}
                  value={firstName}
                  onChange={(text) => setFirstName(text)}
                  placeholder={'Enter your First name'}
                  onSave={(value) => updateUserData('firstName', value)}
                  maxLength={40}
                  validationRules={{ required: { value: true, message: 'First name is required' } }}
                />
                <InputRow
                  title={'Last name'}
                  name={'lastName'}
                  value={lastName}
                  onChange={(text) => setLastName(text)}
                  placeholder={'Enter your Last name'}
                  onSave={(value) => updateUserData('lastName', value)}
                  maxLength={40}
                  validationRules={{ required: { value: true, message: 'Last name is required' } }}
                />
                <InputRow
                  title={'Email address'}
                  name={'email'}
                  value={emailAddress}
                  onChange={(text) => setEmailAddress(text)}
                  placeholder={'your@email.com'}
                  onSave={(value) => updateUserData('email', value)}
                  maxLength={40}
                  autoCapitalize={'none'}
                  validationRules={{
                    required: { value: true, message: 'Email is required' },
                    pattern: { value: emailRegex, message: 'Invalid email' },
                  }}
                />
                <View style={styles.inputItem}>
                  <Text style={[TextStyles.body2, styles.inputItemLabel]}>Phone number</Text>
                  <TouchableOpacity onPress={() => !isPhoneNumberDisabled && onChangePhoneNumberPress()} style={styles.textEditorContainer}>
                    <Text style={[styles.textInputContainer, userInfo?.phone && styles.blackText]}>{userInfo?.phone}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.disablePhoneNumberContainer}>
                <Switch
                  title={'Disable phone number'}
                  titleStyle={styles.disablePhoneNumberItemLabel}
                  enabled={isPhoneNumberDisabled}
                  onChange={() => {
                    setIsPhoneNumberDisabled(!isPhoneNumberDisabled);
                    updateUserData('isPhoneNumberDisabled', !isPhoneNumberDisabled);
                  }}
                />
                <Text style={styles.disabledPhoneNumberDescription}>
                  With a disabled phone number, only users you approve can follow you and watch your photos and videos. Your existing followers won’t be affected.
                </Text>
              </View>
              <InputRow
                title={'Bio'}
                name={'bio'}
                value={bio}
                onChange={(v) => setBio(v)}
                placeholder={'Enter your Bio'}
                onSave={(value) => updateUserData('bio', value)}
                multiline
                maxLength={300}
                validationRules={{ required: { value: true, message: 'Bio is required' } }}
              />
            </View>
            <View style={styles.removeAccountContainer}>
              <MenuItem icon={trashIcon} label={'Remove account'} onPress={() => onRemovePress()} />
            </View>
          </Container>
        </ScrollView>
      </SafeAreaView>
      <BottomSheet
        sheetRef={removeAccountSheetRef}
        title={'Do you want to Remove your account?'}
        onClose={() => setShowRemoveAccountPopup(false)}
        onOutsidePress={hideUploadAvatarSheet}
        isActive={showRemoveAccountPopup}
        showBg
      >
        <View style={styles.removeAccountButtonContainer}>
          <TouchableOpacity style={styles.removeAccountButton} onPress={() => dispatch(removeAccount())}>
            <Text style={styles.removeAccountText}>Remove</Text>
          </TouchableOpacity>
        </View>
          <TouchableOpacity style={styles.cancelSheetButton} onPress={hideRemoveAccountSheet}>
            <Text style={styles.cancelSheetText}>Cancel</Text>
          </TouchableOpacity>
      </BottomSheet>
      <BottomSheet
        sheetRef={uploadAvatarSheetRef}
        onClose={() => setShowUploadAvatarSheet(false)}
        isActive={showUploadAvatarSheet}
        onOutsidePress={hideUploadAvatarSheet}
        showBg
      >
        <View style={styles.uploadAvatarButtonsContainer}>
          <TouchableOpacity style={[styles.uploadAvatarButtons, { paddingBottom: 20 }]} onPress={handleTakePhotoPress}>
            <Text style={styles.cancelSheetText}>Take photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.uploadAvatarButtons, { paddingBottom: 20, paddingTop: 8 }]} onPress={handleUploadPhotoPress}>
            <Text style={styles.cancelSheetText}>Upload photo</Text>
          </TouchableOpacity>
        </View>
          <TouchableOpacity style={styles.cancelSheetButton} onPress={hideUploadAvatarSheet}>
            <Text style={styles.cancelSheetText}>Cancel</Text>
          </TouchableOpacity>
      </BottomSheet>
      <BottomSheet
        sheetRef={changePhoneNumberSheetRef}
        title={'Do you want to change your phone number?'}
        onClose={() => setShowChangePhoneNumberSheet(false)}
        onOutsidePress={hideChangePhoneNumberSheet}
        isActive={showChangePhoneNumberSheet}
        showBg
      >
        <View style={styles.removeAccountButtonContainer}>
          <TouchableOpacity
            style={styles.removeAccountButton}
            onPress={() => {
              hideChangePhoneNumberSheet();
              navigation.navigate(Routes.PhoneSignIn, { isChangingPhoneNumber: true });
            }}
          >
            <Text style={styles.changePhoneNumberText}>Change phone number</Text>
          </TouchableOpacity>
        </View>
          <TouchableOpacity onPress={hideChangePhoneNumberSheet} style={styles.cancelSheetButton}>
            <Text style={styles.cancelSheetText}>Cancel</Text>
          </TouchableOpacity>
      </BottomSheet>
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
    flex: 1,
    justifyContent: 'space-between',
  },
  profileHeaderContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  uploadAvatarButton: {
    marginTop: 12,
    color: Colors.primaryBlue,
  },
  menuItemsContainer: {
    marginTop: 30,
  },
  disablePhoneNumberContainer: {
    marginBottom: 24,
  },
  disablePhoneNumberItemLabel: {
    ...TextStyles.body2,
    color: Colors.black,
  },
  disabledPhoneNumberDescription: {
    marginTop: 8,
    ...TextStyles.smallBody,
    color: Colors.darkGray,
  },
  removeAccountContainer: {
    marginBottom: 100,
  },
  removeAccountButtonContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    alignItems: 'center',
  },
  removeAccountButton: {
    paddingTop: 5,
    paddingBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  removeAccountText: {
    ...TextStyles.h5,
    color: Colors.red,
  },
  cancelSheetButton: {
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cancelSheetText: {
    ...TextStyles.h5,
    color: Colors.darkGray,
  },
  uploadAvatarButtonsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    alignItems: 'center',
    marginTop: 15,
  },
  uploadAvatarButtons: {
    alignItems: 'center',
    width: '100%',
  },
  avatarStyle: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  changePhoneNumberText: {
    ...TextStyles.h5,
    color: Colors.primaryBlue,
  },
  inputItemLabel: {
    color: Colors.black,
    width: Layout.getViewWidth(25),
    marginBottom: 8,
  },
  inputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  textEditorContainer: {
    width: Layout.getViewWidth(62),
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  textInputContainer: {
    ...TextStyles.body2,
    marginBottom: 8,
    color: Colors.darkGray,
  },
  blackText: {
    color: Colors.primaryBlack,
  },
});

export default EditProfile;
