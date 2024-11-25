import { Alert, Linking, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import StorageAsync from 'src/services/Storage';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import { GOOGLE_GEOCODING_API_KEY } from '@env';
import { Location } from 'src/types';
import { getCurrentLocationDetails } from 'src/utils/locationHelper';

export const currentLocationAsked = 'currentLocation:asked';

Geocoder.init(GOOGLE_GEOCODING_API_KEY, { language : 'en' } );

export async function isLocationAsked() {
  return await StorageAsync.getValue(currentLocationAsked);
}

export const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };

  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    await StorageAsync.setValue(currentLocationAsked, 'true');
    return true;
  }

  if (status === 'disabled' || status === 'denied') {
    Alert.alert('Turn on Location Services to allow Domally to determine your location.', '', [{ text: 'Go to Settings', onPress: openSetting }, { text: 'Cancel', style: 'cancel',}]);
    await StorageAsync.setValue(currentLocationAsked, 'true');
  }

  return false;
};

export const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
  }

  return false;
};

export const getLocation = async (): Promise<Location> => {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    return;
  }

  const currentPosition = await getCurrentLocation();
  const detailedLocation = await getLocationDetails(currentPosition.coords.latitude, currentPosition.coords.longitude);

  return detailedLocation;
};

const getCurrentLocation = (): Promise<Geolocation.GeoPosition> => {
  return new Promise((res, rej) => {
    Geolocation.getCurrentPosition(
      (position) => {
        res(position);
        return position;
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        rej(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  });
};

export const getLocationDetails = async (lat: number, lon: number): Promise<Location> => {
  try {
    const result = await Geocoder.from(lat, lon);

    if (!result) {
      return null;
    }

    const geometry = result.results[0].geometry;
    const detailedData = getCurrentLocationDetails(result);

    const location: Location = {
      city: detailedData.city,
      coords: {
        lat: geometry?.location?.lat,
        lon: geometry?.location?.lng,
      },
      address: detailedData.detailedAddress,
    };

    return location;
  } catch (error) {
    console.log('GET CURRENT LOCATION ERROR: ', error);
  }
};
