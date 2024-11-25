import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { CircleButton, Container, Page, Button, TextButton } from 'src/components';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete/GooglePlacesAutocomplete';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocation } from 'src/services/Geolocation';
import { searchLocation, searchType } from 'src/redux/selectors/search';
import { currentPropertyType, currentPropertyLocation, currentPropertyAction } from 'src/redux/selectors/currentProperty';

import { popularLocations, isOnboardingBuyFlow, mainOnboardingAction } from 'src/redux/selectors/app';
import TextStyles, { fontMedium, fontRegular } from 'src/styles/Typography';
import * as Routes from 'src/constants/routes';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { getStepperRoute } from 'src/utils/stepperRoutes';
import { updateSearchFilter } from 'src/redux/actions/search';
import { updateCurrentProperty } from 'src/redux/actions/currentProperty';
import { autocompleteStyles } from '../../styles/stepperScreens/addressSearch';

import { RouteProp } from '@react-navigation/native';
import { getPopularLocations } from 'src/redux/actions/app';

import LocationIcon from 'src/assets/img/icons/location-icon.svg';
import SearchIcon from 'src/assets/img/icons/search-icon.svg';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { Location } from 'src/types';
import { LocationOption } from 'src/constants/search/LocationOptions';
import { setMainOnboardingCompleted } from 'src/utils/storage';
import { getPlaceDetails } from 'src/utils/locationHelper';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'ChooseLocation'>;
  route: RouteProp<RootStackParamsList, 'ChooseLocation'>;
};

const ChooseLocation = (props: Props) => {
  const { navigation, route } = props;
  const autocomplete = useRef<GooglePlacesAutocompleteRef>();
  const [location, setChosenLocation] = useState<Location>(null);
  const [popularOptions, setPopularLocations] = useState<LocationOption[]>(null);
  const isSearchFlow = useSelector(isOnboardingBuyFlow);
  const stateMainOnboardingAction = useSelector(mainOnboardingAction);
  const currentPropertyStateAction = useSelector(currentPropertyAction);
  const statePopularLocations = useSelector(popularLocations);

  const stateSearchLocation = useSelector(searchLocation);
  const stateSearchPropertyType = useSelector(searchType);
  const stateCreateLocation = useSelector(currentPropertyLocation);
  const stateCurrentPropertyType = useSelector(currentPropertyType);

  const stateLocation = route?.params?.isSingleSearchMode || isSearchFlow ? stateSearchLocation : stateCreateLocation;
  const statePropertyType = route?.params?.isSingleSearchMode || isSearchFlow ? stateSearchPropertyType : stateCurrentPropertyType;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!statePopularLocations) {
      dispatch(getPopularLocations());
    }
    setMainOnboardingCompleted();
  }, []);

  useEffect(() => {
    setChosenLocation(stateLocation);
  }, [stateLocation]);

  useEffect(() => {
    if (statePopularLocations) {
      setPopularLocations(statePopularLocations);
    }
  }, [statePopularLocations]);

  useEffect(() => {
    const locationTitle = location?.city;
    if (locationTitle) {
      autocomplete?.current?.setAddressText(locationTitle);
    }
  }, [location]);

  const onCurrentLocationHandler = async () => {
    const currentLocation = await getLocation();

    if (currentLocation) {
      setChosenLocation({
        city: currentLocation.city,
        coords: currentLocation.coords,
        address: null,
      });
    }
  };

  const setLocation = async () => {
    if (isSearchFlow || route?.params?.isSingleSearchMode) {
      await dispatch(updateSearchFilter({ location: location }));
    } else {
      dispatch(updateSearchFilter({ location: location }, false));
      dispatch(
        updateCurrentProperty({
          location: location,
        }),
      );
    }
  };

  const onSubmit = () => {
    setLocation();

    if (route?.params?.onSubmit) {
      route.params.onSubmit();
      return;
    }

    if (!statePropertyType) {
      return;
    }

    const nextRoute = getStepperRoute(stateMainOnboardingAction || currentPropertyStateAction, statePropertyType);

    if (nextRoute) {
      navigation.navigate(nextRoute);
    }
  };

  const onBack = () => {
    if (route?.params?.onBack) {
      route.params.onBack();
    } else {
      navigation.navigate(Routes.ChoosePropertyType);
    }
  };

  const isFocused = autocomplete?.current?.isFocused();

  return (
    <Page onBack={onBack} keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <Text style={[TextStyles.h2, styles.title]}>In which city</Text>
        <View style={[styles.autoCompleteWrap, Platform.OS === 'ios' && styles.autoCompleteWrapIOS]}>
          <GooglePlacesAutocomplete
            ref={autocomplete}
            onPress={(data: GooglePlaceData, details: GooglePlaceDetail = null) => {
              const placeDetails = getPlaceDetails(details);
              setChosenLocation({
                address: null,
                // administrative region as city name only for edge cases
                city: placeDetails?.city || placeDetails?.administrativeAreaName,
                coords: {
                  lat: details?.geometry?.location?.lat,
                  lon: details?.geometry?.location?.lng,
                }
              });
            }}
            onFail={(error) => console.error('GooglePlacesAutocomplete error:', error)}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en',
              types: '(cities)',
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
                top: 46,
                elevation: 20,
                zIndex: 9999,
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                fontFamily: fontRegular,
                fontSize: 16,
                color: Colors.input.text,
                height: 46,
                borderWidth: 0.5,
                borderColor: isFocused ? Colors.searchInput.focusedBorder : Colors.searchInput.border,
                backgroundColor: Colors.searchInput.bg,
                borderRadius: 10,
                lineHeight: Platform.OS === 'ios' ? 0 : 18,
                paddingLeft: 39,
              },
            }}
            placeholder='New York, USA'
            listViewDisplayed={false}
            enablePoweredByContainer={false}
            suppressDefaultStyles
            fetchDetails
            renderLeftButton={() => <SearchIcon style={styles.searchIcon} />}
            textInputProps={{
              placeholder: 'New York, USA',
              autoFocus: false,
              returnKeyType: 'default',
              placeholderTextColor: Colors.darkGray,
              clearButtonMode: 'while-editing',
            }}
          />
        </View>
        <TextButton
          title='Current location'
          icon={LocationIcon}
          onPress={onCurrentLocationHandler}
          containerStyle={styles.locationBtn}
          titleStyle={styles.locationBtnText}
        />
        <View style={styles.divider} />
        <Text style={[TextStyles.body3, styles.gridTitle]}>POPULAR LOCATION</Text>
        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsWrap}>
          {popularOptions?.map((item, index) => (
            <CircleButton
              key={item.city}
              styleWrap={[styles.circleButton]}
              iconUri={item.iconUrl}
              title={item.city}
              index={index}
              onPress={() => setChosenLocation(item)}
              isActive={location?.city === item.city}
            />
          ))}
        </ScrollView>
      </Container>
      {location ? (
        <View style={styles.btnWrap}>
          <Button title={route?.params?.isSingleSearchMode ? 'Select' : 'Next'} onPress={onSubmit} />
        </View>
      ) : null}
    </Page>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? (Layout.isMediumDevice ? Layout.getViewHeight(10.7) : Layout.getViewHeight(13.2)) : Layout.getViewHeight(10.7),
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
  locationBtn: {
    marginBottom: 13,
    alignSelf: 'flex-start',
    zIndex: -1,
  },
  locationBtnText: {
    color: Colors.primaryBlue,
    fontFamily: fontMedium,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray,
    borderRadius: 100,
    marginBottom: 16,
    zIndex: -1,
  },
  gridTitle: {
    marginBottom: 16,
    zIndex: -1,
  },
  optionsWrap: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: Layout.isMediumDevice ? 80 : 100,
    zIndex: -1,
  },
  circleButton: {
    marginBottom: 21,
  },
  crossIcon: {
    width: 14,
    height: 14,
  },
  crossWrap: {
    width: 30,
    height: 30,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 8,
    top: 8,
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

export default ChooseLocation;
