import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Region } from 'react-native-maps';
import { StyleSheet, View, Image, Text } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import Layout from 'src/constants/Layout';
import { Location } from 'src/types';
import { getLocation, getLocationDetails } from 'src/services/Geolocation';
import Button from './Button';
import Map from './Map';
import Preloader from './Preloader';
import { fontMedium } from 'src/styles/Typography';
import CircleButton from './CircleButton';

import PinImage from 'src/assets/img/map-pin.png';
import CurrentLocationIcon from 'src/assets/img/icons/current-location-icon.svg';
import LocationIcon from 'src/assets/img/icons/chosen-location-icon.svg';

const LATITUDE_DELTA = 0.07;
const LONGITUDE_DELTA = LATITUDE_DELTA * (Layout.window.width / Layout.window.height);

const DEFAULT_REGION_COORDS: Region = {
  latitude: 37.72825,
  longitude: -122.4324,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

type MapProps = {
  location: Location;
  onLocationSubmit: (location: Location) => void;
};

function ChooseOnMap(props: MapProps) {
  const { location, onLocationSubmit } = props;

  const [chosenLocation, setChosenLocation] = useState<Location>(null);
  const [currentRegion, setCurrentRegion] = useState<Partial<Region>>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (location) {
      setChosenLocation(location);
      setCurrentRegion({
        latitude: location.coords.lat,
        longitude: location.coords.lon,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [location]);

  useEffect(() => {
    const getCoords = async () => {
      setLoading(true);
      await setDetailedLocation();
      setLoading(false);
    };

    if (currentRegion) {
      getCoords();
    }
  }, [currentRegion]);

  const onCurrentLocationHandler = async () => {
    const currentLocation = await getLocation();

    if (currentLocation) {
      setCurrentRegion({
        latitude: currentLocation.coords.lat,
        longitude: currentLocation.coords.lon,
      });
    }
  };

  const setDetailedLocation = async () => {
    const detailedLocation = await getLocationDetails(currentRegion.latitude, currentRegion.longitude);

    if (detailedLocation) {
      setChosenLocation(detailedLocation);
    }
  }

  const onLocationChangeComplete = (region: Region) => {
    if (isLoading) return false;
    setCurrentRegion(region);
  };

  const onLocationConfirm = async () => {
    onLocationSubmit(chosenLocation);
  }

  const renderSheetContent = (): ReactNode => {
    return (
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetContainer}>
          <Text style={[TextStyles.cardTitle1, styles.sheetTitle]}>Confirm address</Text>
          <View style={styles.divider} />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetAddressWrap}>
              <LocationIcon style={styles.locationIcon} />
              <Text style={[TextStyles.body1, styles.sheetAddress]}>{chosenLocation?.address}</Text>
            </View>
            <Button style={styles.confirmBtn} title='Confirm' onPress={onLocationConfirm} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {isLoading && <Preloader />}
      <Map
        style={styles.map}
        showsUserLocation={true}
        region={{
          latitude: currentRegion?.latitude || DEFAULT_REGION_COORDS.latitude,
          longitude: currentRegion?.longitude || DEFAULT_REGION_COORDS.longitude,
          latitudeDelta: currentRegion?.latitudeDelta || DEFAULT_REGION_COORDS.latitudeDelta,
          longitudeDelta: currentRegion?.longitudeDelta || DEFAULT_REGION_COORDS.longitudeDelta,
        }}
        onRegionChangeComplete={onLocationChangeComplete}
        showsBuildings={false}
        pitchEnabled={false}
        showsCompass={false}
        showsIndoors={false}
        zoomTapEnabled={false}
        rotateEnabled={false}
      />
      <Image style={styles.markerFixed} source={PinImage} />
      <CircleButton
        styleWrap={styles.locationBtnWrap}
        styleBtn={styles.locationBtn}
        iconStyles={styles.locationBtnIcon}
        icon={CurrentLocationIcon}
        onPress={onCurrentLocationHandler}
        index={0}
      />
      <BottomSheet
        ref={sheetRef}
        snapPoints={[265, 0]}
        initialSnap={0}
        borderRadius={0}
        renderContent={renderSheetContent}
        enabledInnerScrolling={true}
        enabledGestureInteraction={false}
      />
    </>
  )
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  markerFixed: {
    left: Layout.window.width / 2,
    marginLeft: -30,
    marginTop: -71,
    position: 'absolute',
    top: Layout.window.height / 2,
    height: 71,
    width: 60,
  },
  bottomSheet: {
    width: '100%',
    alignItems: 'center',
    overflow: 'visible',
    backgroundColor: 'transparent',
    paddingTop: 22,
    elevation: 55,
    zIndex: 25,
  },
  bottomSheetContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 5,
    paddingTop: 15,
    shadowColor: 'rgba(14, 20, 56, 0.04)',
    shadowOpacity: 1,
  },
  sheetTitle: {
    color: Colors.primaryBlack,
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray,
    alignSelf: 'center',
    marginBottom: 22,
  },
  bottomSheetDivider: {
    alignSelf: 'center',
    width: 32,
    height: 4,
    backgroundColor: Colors.darkGray,
    opacity: 0.6,
    borderRadius: 64,
    marginBottom: 10,
  },
  sheetContainer: {
    paddingHorizontal: 32,
  },
  sheetAddressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sheetAddress: {
    fontFamily: fontMedium,
  },
  locationIcon: {
    marginRight: 4,
  },
  confirmBtn: {
    marginBottom: 44,
  },
  locationBtnWrap: {
    position: 'absolute',
    right: 16,
    bottom: 250,
  },
  locationBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowColor: 'rgba(23, 32, 52, 0.08)',
    shadowOpacity: 1
  },
  locationBtnIcon: {
    width: 30,
    height: 30,
    marginLeft: -2,
  }
});

export default ChooseOnMap;
