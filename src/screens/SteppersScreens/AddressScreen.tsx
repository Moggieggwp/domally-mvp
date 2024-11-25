import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, InputAccessoryView, Keyboard, KeyboardEvent, Alert, Animated, Platform } from 'react-native';
import { Container, Page, Button, TextButton, TextInput, ChooseOnMap, BackButton } from 'src/components';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete/GooglePlacesAutocomplete';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Modal from 'react-native-modal';
import { getLocation } from 'src/services/Geolocation';
import { currentPropertyLocation, currentPropertyId } from 'src/redux/selectors/currentProperty';

import { fontMedium } from 'src/styles/Typography';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { autocompleteStyles } from '../../styles/stepperScreens/addressSearch';
import { saveProperty } from 'src/redux/actions/currentProperty';

import { GOOGLE_PLACES_API_KEY } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { Location } from 'src/types';
import StepperTitle from 'src/components/stepper/StepperTitle';
import LocationIcon from 'src/assets/img/icons/location-icon.svg';
import MapIcon from 'src/assets/img/icons/map-pin-icon.svg';
import { getPlaceDetails } from 'src/utils/locationHelper';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const AddressScreen = (props: Props) => {
  const { navigation, onNext } = props;
  const inputAccessoryViewID = 'buttonsID';
  const autocomplete = useRef<GooglePlacesAutocompleteRef>(null);
  const [location, setChosenLocation] = useState<Location>(null);
  const [inputValue, setInputValue] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const stateLocation = useSelector(currentPropertyLocation);
  const propertyId = useSelector(currentPropertyId);
  const translateY = useState(new Animated.Value(70))[0];
  const moveButton = useState(new Animated.Value(0))[0];

  const dispatch = useDispatch();

  const move = (toValue: number, state: Animated.Value) => {
    Animated.timing(state, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const moveAnimatedStyle = (value: Animated.Value) => ({
    transform: [
      {
        translateY: value,
      },
    ],
  });

  const onKeyboardDidShow = (e: KeyboardEvent) => {
    move(0, translateY);
    move(70, moveButton);
  };

  const onKeyboardDidHide = (e: KeyboardEvent) => {
    move(70, translateY);
    move(styles.btnWrap.bottom, moveButton);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
      const showKeyboard = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
      const hideKeyboard = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
      return () => {
        showKeyboard.remove();
        hideKeyboard.remove();
        AndroidKeyboardAdjust.setAdjustPan();
      };
    }
  }, []);

  useEffect(() => {
    const locationAddress = location?.address || location?.city;

    if (locationAddress) {
      autocomplete?.current?.setAddressText(locationAddress);
      setInputValue(locationAddress);
    }
  }, [location]);

  useEffect(() => {
    if (stateLocation) {
      setChosenLocation(stateLocation);
    }
  }, [stateLocation]);

  const onCurrentLocationHandler = async () => {
    const currentLocation = await getLocation();

    if (currentLocation) {
      Keyboard.dismiss();
      setChosenLocation(currentLocation);
    }
  };

  const onLocationConfirm = (location: Location) => {
    if (!location) return;

    setChosenLocation(location);
    setModalVisible(false);
  };

  const isValidLocation = () => {
    if (!location.address) {
      Alert.alert('You need to set detailed address');
      return false;
    }

    return true;
  };

  const chooseOnMapHandler = () => {
    Keyboard.dismiss();
    setModalVisible(true);
  };

  const onSubmit = async () => {
    const isValid = isValidLocation();
    if (!isValid) return;

    await dispatch(
      saveProperty({
        id: propertyId,
        location: location,
      }),
    );

    onNext();
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle style={styles.title} title='Address' />
        <View style={[styles.autoCompleteWrap, Platform.OS === 'ios' && styles.autoCompleteWrapIOS]}>
          <GooglePlacesAutocomplete
            ref={autocomplete}
            onPress={(data: GooglePlaceData, details: GooglePlaceDetail = null) => {
              const placeDetails = getPlaceDetails(details);

              setChosenLocation({
                city: placeDetails.city,
                address: placeDetails.detailedAddress,
                coords: {
                  lat: details?.geometry?.location?.lat,
                  lon: details?.geometry?.location?.lng,
                },
              });

              setInputValue(data?.description);
            }}
            onFail={(error) => console.error('GooglePlacesAutocomplete error:', error)}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en',
              types: 'address',
            }}
            debounce={500}
            minLength={2}
            styles={{
              ...autocompleteStyles,
              container: {
                position: 'absolute',
                height: 46,
                width: '100%',
              },
              listView: {
                backgroundColor: Colors.white,
                marginTop: 0,
                position: 'absolute',
                left: 0,
                top: 50,
                zIndex: 20,
                elevation: 20,
              },
            }}
            placeholder=''
            listViewDisplayed={null}
            enablePoweredByContainer={false}
            suppressDefaultStyles
            fetchDetails
            textInputProps={{
              InputComp: TextInput,
              withClear: inputValue?.length > 0,
              label: 'Address',
              value: inputValue,
              onChangeText: (value) => setInputValue(value),
              autoFocus: !location?.address,
              inputAccessoryViewID: inputAccessoryViewID,
              returnKeyType: 'default',
              placeholderTextColor: Colors.darkGray,
              clearButtonMode: 'while-editing',
            }}
          />
        </View>
        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <View style={styles.keyboardBtnWrap}>
              <TextButton
                title='Current location'
                icon={LocationIcon}
                onPress={onCurrentLocationHandler}
                containerStyle={styles.keyboardBtn}
                titleStyle={styles.keyboardBtnText}
              />
              <View style={styles.divider} />
              <TextButton title='Choose on map' icon={MapIcon} onPress={chooseOnMapHandler} containerStyle={styles.keyboardBtn} titleStyle={styles.keyboardBtnText} />
            </View>
          </InputAccessoryView>
        ) : (
          <Animated.View style={[styles.keyboardBtnWrap, styles.keyboardBtnWrapAndroid, moveAnimatedStyle(translateY)]}>
            <TextButton
              title='Current location'
              icon={LocationIcon}
              onPress={onCurrentLocationHandler}
              containerStyle={styles.keyboardBtn}
              titleStyle={styles.keyboardBtnText}
            />
            <View style={styles.divider} />
            <TextButton title='Choose on map' icon={MapIcon} onPress={chooseOnMapHandler} containerStyle={styles.keyboardBtn} titleStyle={styles.keyboardBtnText} />
          </Animated.View>
        )}
      </Container>

      {Platform.OS === 'ios' ? (
        location && (
          <View style={styles.btnWrap}>
            <Button title='Next' onPress={onSubmit} />
          </View>
        )
      ) : (
        <Animated.View style={[styles.btnWrap, moveAnimatedStyle(moveButton)]}>
          <Button title='Next' onPress={onSubmit} />
        </Animated.View>
      )}
      <Modal style={styles.modal} isVisible={isModalVisible} animationIn='fadeIn' animationOut='fadeOut'>
        <View style={styles.modalView}>
          <BackButton onPress={() => setModalVisible(false)} style={styles.backButton} />
          {isModalVisible && location?.coords && <ChooseOnMap location={location} onLocationSubmit={onLocationConfirm} />}
        </View>
      </Modal>
    </Page>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (Layout.isMediumDevice ? Layout.getViewHeight(3.9) : Layout.getViewHeight(6.8)) : 16,
    left: 16,
    zIndex: 10,
    elevation: 10,
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  modal: {
    width: Layout.window.width,
    height: Layout.window.height,
    padding: 0,
    margin: 0,
  },
  modalView: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 17,
    top: 17,
    alignContent: 'center',
    alignSelf: 'center',
    width: 12,
    height: 12,
    zIndex: 1,
  },
  btnWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.white,
    paddingTop: 17,
    paddingBottom: Layout.isMediumDevice ? 20 : 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  keyboardBtn: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '50%',
  },
  keyboardBtnText: {
    color: Colors.primaryBlue,
    fontFamily: fontMedium,
  },
  divider: {
    width: 1,
    height: 39,
    backgroundColor: Colors.gray,
    borderRadius: 100,
  },
  keyboardBtnWrap: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 15,
    shadowColor: 'rgba(14, 20, 56, 0.04)',
    shadowOpacity: 1,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    elevation: 1,
    ...Platform.select({
      android: {
        shadowColor: 'rgba(14, 20, 56, 0.4)',
      },
    }),
  },
  keyboardBtnWrapAndroid: {
    position: 'absolute',
    width: Layout.window.width,
    zIndex: 50,
    bottom: 0,
    left: 0,
  },
  autoCompleteWrap: {
    position: 'relative',
    height: 46,
    width: '100%',
    marginBottom: 16,
  },
  autoCompleteWrapIOS: {
    zIndex: 100,
  },
});

export default AddressScreen;
