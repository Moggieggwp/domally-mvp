import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { CircleButton, MapCarousel, Preloader, SearchInput } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { CURRENCY_BUTTONS } from 'src/constants/MeasureButtons';
import * as Routes from 'src/constants/routes';
import useDidUpdateEffect, { useBackButtonListener } from 'src/helpers/hooks';
import { setOnboardingAction } from 'src/redux/actions/app';
import { saveFcmToken } from 'src/redux/actions/notification';
import { updateSearchData, updateSearchFilter } from 'src/redux/actions/search';
import { isWhoAreYouPopupVisibleSelector, metricsSelector } from 'src/redux/selectors/app';
import { isPremiumSelector, isSignedInSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { searchDataSelector, searchGraphicFilter, searchLocation, searchResultCountSelector, searchResultMapSelector } from 'src/redux/selectors/search';
import HelpPopUp from 'src/screens/Popup';
import { getLocation } from 'src/services/Geolocation';
import { handleDeepLink } from 'src/services/NavigationService';
import Notification from 'src/services/Notification';
import { TextStyles } from 'src/styles/BaseStyles';
import mapStyles, { mapMarkersClustersStyles as mapMarkersStyles } from 'src/styles/MapStyles';
import { Coords, Location, PolygonSearchType, Property, SearchType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import {
  convertBoundariesToRegion,
  convertCoordsToLatLng,
  convertCoordsToNumbersArray,
  convertLatLngToCoords,
  convertNumbersArrayToCoords,
  convertRegionToPolygon,
  convertToCoords,
  convertToLatLng,
} from 'src/utils/locationHelper';
import { getCorrectCurrencyMeasure } from 'src/utils/metricsHelper';
import MapPropertyCard from '../components/MapPropertyCard';
import MapView, { IDrawResult, ILocationProps, TouchPoint } from './components';
import MapPolygon from './map-utils/polygon';
import CurrentLocationIcon from 'src/assets/img/icons/current-location-icon.svg';
import DrawCancelIcon from 'src/assets/img/icons/draw-icon-close.svg';
import DrawOnMapIcon from 'src/assets/img/icons/draw-icon.svg';
import DrawPlaceholderIcon from 'src/assets/img/icons/draw-on-map-placeholder.svg';
import ListIcon from 'src/assets/img/icons/list-icon.svg';
import CloseIcon from 'src/assets/img/icons/close-icon.svg';
import priceFormatter from 'src/helpers/priceFormatter';

const DEFAULT_PADDING = { top: 100, right: 90, bottom: 120, left: 90 };
const MAP_MIN_ZOOM = 6.15;
const MAP_MAX_ZOOM = 19;

const LATITUDE_DELTA = 0.2;
const LONGITUDE_DELTA = LATITUDE_DELTA * (Layout.window.width / Layout.window.height);

const INITIAL_REGION = {
  latitude: 43.638830778,
  longitude: -79.385665124,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const TAB_BAR_HEIGHT = Layout.getViewHeight(11.8);

type Props = {
  navigation: BottomTabNavigationProp<RootStackParamsList>;
  route: RouteProp<RootStackParamsList, 'Search'>;
};

type PolygonData = {
  polygon: Coords[];
  center: Coords;
};

const EMPTY_POLYGON_DATA = {
  polygons: [],
  distance: 0,
  lastLatLng: undefined,
  initialLatLng: undefined,
  centerLatLng: undefined,
};

const Search = (props: Props) => {
  const { navigation } = props;
  const isWhoAreYouPopupVisible = useSelector(isWhoAreYouPopupVisibleSelector);
  const stateSearchLocation = useSelector(searchLocation);
  const stateGraphFilter = useSelector(searchGraphicFilter);
  const stateSearchData = useSelector(searchDataSelector);
  const appMetrics = useSelector(metricsSelector);
  const isSignIn = useSelector(isSignedInSelector);
  const profileData = useSelector(profileDataSelector);
  const propertiesCount = useSelector(searchResultCountSelector);
  const isPremium = useSelector(isPremiumSelector);

  const searchProperties = useSelector(searchResultMapSelector);
  const isFocused = useIsFocused();
  const backListener = useBackButtonListener();

  const hasPolygon = stateGraphFilter?.polygon?.coordinates?.length > 0;
  const hasCustomPolygon = hasPolygon && stateGraphFilter?.polygonSearchType === PolygonSearchType.CUSTOM;

  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [propertiesList, setPropertiesList] = useState<Property[]>(null);
  const [location, setChosenLocation] = useState<Location>(stateSearchLocation);
  const [inputValue, setInputValue] = useState(stateSearchLocation?.city || '');
  const [currentProperty, setCurrentProperty] = useState<Property>(null);
  const [viewportPolygonData, setViewportPolygonData] = useState<PolygonData>(null);
  const [areaBtnVisible, setAreaBtnVisible] = useState(false);
  const [isDrawPlaceholderHidden, setIsDrawPlaceholderHidden] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [sliderProperties, setSliderProperties] = useState<Property[]>(null);
  const [sliderCurrentPropertyId, setSliderCurrentPropertyId] = useState<number>(null);
  const [activeClusterId, setActiveClusterId] = useState(null);

  const mapRef = useRef(null);
  const sheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();

  const initialPolygonCoords = hasCustomPolygon ? convertCoordsToLatLng(convertNumbersArrayToCoords(stateGraphFilter?.polygon?.coordinates)) : [];

  const initialPolygon = useRef({
    polygons: initialPolygonCoords,
    distance: 0,
    lastLatLng: undefined,
    initialLatLng: undefined,
    centerLatLng: convertToLatLng(stateSearchLocation?.coords),
  });

  // for drawing
  const [modePolygon, setPolygonCreated] = useState<boolean>(hasCustomPolygon);
  const [isActiveDraw, setDrawMode] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [points, setPoints] = useState<TouchPoint[]>([]);
  const [polygon, setPolygon] = useState<IDrawResult>(initialPolygon.current);
  // for drawing

  useEffect(() => {
    if (!isFocused || !isReady) {
      return;
    }

    doSearch();
  }, [isFocused, isReady]);

  useDidUpdateEffect(() => {
    if (!stateGraphFilter) {
      setPolygon(EMPTY_POLYGON_DATA);
      setPolygonCreated(false);
      setAreaBtnVisible(true);
    }

    if (stateGraphFilter?.polygonSearchType === PolygonSearchType.CUSTOM) {
      const poly = convertCoordsToLatLng(convertNumbersArrayToCoords(stateGraphFilter?.polygon?.coordinates));
      const center = convertToLatLng(stateSearchLocation?.coords);
      setPolygon({
        ...polygon,
        polygons: poly,
        centerLatLng: center,
      });
      setPolygonCreated(true);
    }
    
  }, [stateGraphFilter]);

  useDidUpdateEffect(() => {
    if (!modePolygon) return;
    doCustomPolygonSearch();
  }, [modePolygon]);

  useEffect(() => {
    dynamicLinks().getInitialLink().then(handleDeepLink);
    dispatch(setOnboardingAction(null));
  }, []);

  useEffect(() => {
    if (isSignIn) {
      Notification.requestUserPermission((fcmToken) => {
        dispatch(saveFcmToken(fcmToken));
      });

      Notification.createNotificationListeners();
    }
  }, [isSignIn]);

  useEffect(() => {
    if (!isFocused || !isSignIn) return;
    if (!profileData?.firstName || !profileData.lastName || !profileData.email) {
      navigation.navigate(Routes.UserAbout);
    }
  }, [isFocused]);

  useDidUpdateEffect(() => {
    if (stateSearchLocation) {
      setChosenLocation(stateSearchLocation);
    }
  }, [stateSearchLocation]);

  useEffect(() => {
    setPropertiesList(searchProperties);

    if (currentProperty) {
      const property = searchProperties?.find((x) => x.id === currentProperty.id);
      if (!property && !sliderProperties?.length) {
        sheetRef.current.snapTo(1);
      }
      setCurrentProperty(property);
    }

    if (sliderProperties?.length) {
      const result = [];
      sliderProperties.forEach(p => {
        const property = searchProperties?.find(item => item.id === p.id);
        if (property) {
          result.push(property);
        }
      });

      if (!result?.length && !currentProperty) {
        sheetRef.current.snapTo(1);
      }
      setSliderProperties(result);
    }

    if (!searchProperties?.length) {
      sheetRef.current.snapTo(1);
    }
  }, [searchProperties]);

  useDidUpdateEffect(() => {
    if (!location) {
      setCameraDefaultRegion();
      return;
    };

    setInputValue(location.city);
    mapRef.current.setCamera({
      center: convertToLatLng(location.coords),
      zoom: MAP_MIN_ZOOM,
    });

    if (!hasCustomPolygon) {
      handleLocationChange(location);
    }

    handleSheetClose();
  }, [location?.city]);

  useEffect(() => {
    if (!isSignIn) return;
    checkFeedbackPopupVisibility();
  }, [isWhoAreYouPopupVisible]);

  const handleLocationChange = async (newLocation: Location) => {
    if (!newLocation) return;
    await clearPolygonData();

    await doViewportSearch();
  };

  const clearPolygonData = async () => {
    await dispatch(updateSearchData({
      filter: {
        polygon: undefined,
        polygonSearchType: undefined,
      },
    }, false));
  };

  const doSearch = async () => {
    if (modePolygon) {
      await doCustomPolygonSearch();
      return;
    }

    await doViewportSearch();
  };

  const getMapBoundariesPolygon = async () => {
    const bounds = await mapRef.current.getMapBoundaries();
    const calculatedRegion = convertBoundariesToRegion(bounds);
    const calculatedPolygon = convertRegionToPolygon(calculatedRegion);
    const regionCenter: Coords = { lat: calculatedRegion.latitude, lon: calculatedRegion.longitude };

    return {
      polygon: calculatedPolygon,
      center: regionCenter,
    };
  };

  const doViewportSearch = async () => {
    if (!stateSearchLocation) return;
    const viewportData = await getMapBoundariesPolygon();
    if (viewportData?.polygon) {
      await doPolygonSearch(viewportData.polygon, viewportData.center, PolygonSearchType.VIEWPORT);
    }
  };

  const doCustomPolygonSearch = async () => {
    if (!polygon?.polygons?.length) return;
    const convertedPoly = convertLatLngToCoords(polygon.polygons);
    const convertedCenter = convertToCoords(polygon.centerLatLng);
    await doPolygonSearch(convertedPoly, convertedCenter, PolygonSearchType.CUSTOM);
    setIsSearchLoading(false);
    // @ts-ignore: Unreachable
    await zoomCenterPolygon(polygon.centerLatLng);
  };

  const doPolygonSearch = async (polygon: Coords[], center: Coords, searchType: PolygonSearchType) => {
    if (!polygon?.length || !center || !searchType) return;

    await dispatch(
      updateSearchData({
        searchType: SearchType.MAP,
        filter: {
          polygon: {
            coordinates: convertCoordsToNumbersArray(polygon),
          },
          polygonSearchType: searchType,
        },
        query: {
          ...stateSearchData.query,
          location: {
            ...stateSearchLocation,
            coords: center,
          },
        },
      }),
    );

    await dispatch(
      updateSearchData({
        currency: appMetrics?.currency,
        square: appMetrics?.square,
        searchType: SearchType.COUNT,
      }),
    );
  };

  const handleMapReady = useCallback(() => {
    if (mapRef.current) {
      setIsReady(true);
    }
  }, []);

  const handleRemovePolygon = async () => {
    setPolygon(EMPTY_POLYGON_DATA);
    setPolygonCreated(false);
    setAreaBtnVisible(true);

    await doViewportSearch();
  };

  const handlePolygonRemoveAlert = (cb: () => void) => {
    Alert.alert('Warning', 'Geographic filters will be reset if you proceed.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Continue',
        onPress: cb,
        style: 'destructive',
      },
    ]);
  };

  const onStartDrawing = () => {
    setIsDrawPlaceholderHidden(true);
    handleClear();
  };

  const handleClear = () => {
    setPolygon(EMPTY_POLYGON_DATA);
    setPolygonCreated(false);
    setPoints([]);
  };

  const handleIsDraw = useCallback(() => {
    if (!mapRef.current) return;

    setDrawMode((prevMode) => !prevMode);
    setIsDrawPlaceholderHidden((prevMode) => !prevMode);
    setPoints([]);
  }, [handleClear, isActiveDraw]);

  const handleCanvasEndDraw = async (locations) => {
    // minimum number of 3 points are required to form a polygon
    if (locations?.polygons?.length <= 2) {
      setPoints([]);
      return;
    }

    setIsSearchLoading(true);
    setPolygon(locations);
    setPolygonCreated(true);
    setDrawMode(false);
  };

  const zoomCenterPolygon = async (center: ILocationProps) => {
    if (!mapRef.current) return;
    const camera = await mapRef.current.getCamera();
    if (Platform.OS === 'ios') {
      mapRef.current.animateCamera({
        center: center,
      });
    }
    if (Platform.OS === 'android') {
      mapRef.current.animateCamera({
        center: center,
      });
    }
  };

  const handlePolygon = useCallback(() => {
      return !isActiveDraw && <MapPolygon key={polygon.distance} coordinates={polygon.polygons} />;
    },
    [isActiveDraw, polygon],
  );

  const onChangePoints = useCallback((value) => {
    setPoints(value);
  }, []);

  const setCameraDefaultRegion = async () => {
    await mapRef.current.setCamera({
      center: {
        latitude: INITIAL_REGION.latitude,
        longitude: INITIAL_REGION.longitude,
      },
    });
  };

  const onPopUpSubmit = () => {
    setPopUpVisible(false);
  };

  const checkFeedbackPopupVisibility = () => {
    if (isWhoAreYouPopupVisible) {
      setPopUpVisible(true);
    }
  };

  const onCurrentLocationHandler = async () => {
    const currentLocation = await getLocation();
    if (currentLocation) {
      dispatch(updateSearchFilter({location: currentLocation}, false));

      const { coords } = currentLocation;

      await mapRef.current.animateCamera({
        center: {
          latitude: coords.lat,
          longitude: coords.lon,
        },
      });
    }
  };

  const onLocationChangeHandler = () => {
    if (hasCustomPolygon) {
      handlePolygonRemoveAlert(() => {
        handleRemovePolygon();
        navigateToChooseLocation();
      });
    } else {
      navigateToChooseLocation();
    }
  };

  const navigateToChooseLocation = () => {
    navigation.navigate(Routes.ChooseLocation, {
      isSingleSearchMode: true,
      onBack: () => {
        navigation.navigate(Routes.Search);
      },
      onSubmit: () => {
        navigation.navigate(Routes.Search);
      },
    });
  };

  const onRegionChange = async (r: Region) => {
    const calculatedPolygon = convertRegionToPolygon(r);
    setViewportPolygonData({
      polygon: calculatedPolygon,
      center: {
        lat: r.latitude,
        lon: r.longitude,
      },
    });

    if (!isActiveDraw && !modePolygon && viewportPolygonData?.polygon?.length && JSON.stringify(calculatedPolygon) !== JSON.stringify(viewportPolygonData?.polygon)) {
      setAreaBtnVisible(true);
    }
  };

  const onMarkerPress = useCallback((property: Property) => {
    clearSliderData();
    setCurrentProperty(property);
    sheetRef.current.snapTo(0);
  }, [sliderProperties]);

  const handleSearchInArea = async () => {
    await doPolygonSearch(viewportPolygonData.polygon, viewportPolygonData.center, PolygonSearchType.VIEWPORT);
    setAreaBtnVisible(false);
  };

  const renderMarkers = useMemo(() => {
    if (!propertiesList?.length) return null;

    return propertiesList.map((p) => {
      const isActive = (p.id === currentProperty?.id) || (p.id === sliderCurrentPropertyId);

      var priceUnit = getCorrectCurrencyMeasure(p?.price);
      var currencyMeasure = CURRENCY_BUTTONS.find((s) => s.measure == priceUnit?.measure)?.symbol || '';

      return (
        <Marker
          key={`${p.id}_${isActive}_${priceUnit?.measure}`}
          identifier={p.id.toString()}
          onPress={() => onMarkerPress(p)}
          pinColor={'transparent'}
          tracksViewChanges={false}
          style={{ zIndex: isActive ? 20 : 1, overflow: 'visible' }}
          coordinate={{
            longitude: p.location?.coords?.lon,
            latitude: p.location?.coords?.lat,
          }}
        >
          <View style={[styles.marker, { backgroundColor: isActive ? Colors.black : Colors.white }]}>
            <Text style={[styles.markerText, { color: isActive ? Colors.white : Colors.black }]}>{`${currencyMeasure}${priceFormatter(priceUnit?.value)}`}</Text>
          </View>
          <View style={[styles.triangle, { borderBottomColor: isActive ? Colors.black : Colors.white }]} />
        </Marker>
      );
    });
  }, [propertiesList, currentProperty, appMetrics?.currency, sliderCurrentPropertyId]);

  const renderCluster = useCallback((cluster) => {
    if (!propertiesList?.length) return;

    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;
    const isActive = activeClusterId === id;

    return (
      <Marker
        key={`cluster-${id}-${isActive}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
        tracksViewChanges={false}
      >
        <View style={[mapMarkersStyles.clusterWrap, { backgroundColor: isActive ? Colors.primaryBlack : Colors.white }]}>
          <Text style={[mapMarkersStyles.clusterText, { color: isActive ? Colors.white : Colors.primaryBlack }]}>{points}</Text>
        </View>
      </Marker>
    );
  }, [propertiesList, activeClusterId]);

  const handleSheetClose = () => {
    setCurrentProperty(null);
    clearSliderData();
  };

  const clearSliderData = () => {
    setSliderProperties(null);
    setSliderCurrentPropertyId(null);
    setActiveClusterId(null);
  };

  const onClusterPress = (cluster: Marker, markers?: Marker[]) => {
    // @ts-ignore: Unreachable
    const propertyIds = markers.map(m => m.properties.identifier);
    const properties = propertiesList.filter(p => propertyIds.includes(p.id.toString()));
    if (!properties) return;

    const propertyAddress = properties[0]?.location?.address;
    const hasSameAddress = properties.every(p => p.location.address === propertyAddress);

    if (hasSameAddress) {
      setCurrentProperty(null);
      // @ts-ignore
      setActiveClusterId(cluster?.id);
      setSliderProperties(properties);
      sheetRef.current.snapTo(0);
    } else {
    // @ts-ignore: Unreachable
      const coordinates = markers.map(({ geometry }) => ({
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: DEFAULT_PADDING,
      });
    }
  };

  const onMapSliderChange = useCallback((propertyId: number) => {
    if (!propertyId) return;
    setSliderCurrentPropertyId(propertyId);
  }, []);

  const renderSheetContent = (): ReactNode => {
    if (!currentProperty && !sliderProperties?.length) return null;
    const isSliderVisible = sliderProperties?.length > 0;

    return (
      <View style={[styles.bottomSheet, isSliderVisible && styles.bottomSheetSlider]}>
        {!sliderProperties?.length && currentProperty &&
          <MapPropertyCard
            style={styles.propertyCard}
            property={currentProperty}
            isSignedIn={isSignIn}
            isPremium={isPremium}
            onCardPress={() => navigation.navigate(Routes.PropertyDetails, { propertyId: currentProperty.id })}
          />
        }

        {isSliderVisible &&
          <>
            <MapCarousel
              isSignIn={isSignIn}
              properties={sliderProperties}
              onChange={onMapSliderChange}
            />
            <TouchableOpacity
              onPress={() => sheetRef.current.snapTo(1)}
              activeOpacity={1}
              style={styles.closeSliderBtn}
            >
              <CloseIcon width={15} height={15} style={styles.closeSliderIcon} />
            </TouchableOpacity>
          </>
        }
      </View>
    );
  };

  const isAreaBtnVisible = areaBtnVisible && !isActiveDraw && !modePolygon;

  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={[mapMarkersStyles.map, styles.map]}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyles}
          initialRegion={{
            latitude: location?.coords?.lat || INITIAL_REGION.latitude,
            longitude: location?.coords?.lon || INITIAL_REGION.longitude,
            latitudeDelta: INITIAL_REGION.latitudeDelta,
            longitudeDelta: INITIAL_REGION.longitudeDelta,
          }}
          points={points}
          widthLine={3}
          onEndDraw={handleCanvasEndDraw}
          isDrawMode={isActiveDraw}
          onMapReady={handleMapReady}
          onStartDraw={onStartDrawing}
          createdPolygon={modePolygon}
          showsBuildings={false}
          pitchEnabled={false}
          onChangePoints={onChangePoints}
          backgroundCanvas={'transparent'}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          showsIndoors={false}
          zoomTapEnabled={false}
          rotateEnabled={false}
          minZoomLevel={MAP_MIN_ZOOM}
          maxZoomLevel={MAP_MAX_ZOOM}
          clusteringEnabled
          renderCluster={renderCluster}
          onClusterPress={onClusterPress}
          onRegionChangeComplete={onRegionChange}
        >
          {isReady && !isActiveDraw && modePolygon && polygon.polygons?.length > 0 && handlePolygon()}
          {isReady && !isActiveDraw && !isSearchLoading && propertiesList?.length !== 0 && renderMarkers}
        </MapView>
        <View style={styles.inputsWrap}>
          {!isActiveDraw &&
            <View style={styles.searchInputWrap}>
              <SearchInput
                styleWrap={styles.searchInput}
                onChange={(v) => { }}
                onFilterPress={() => navigation.navigate(Routes.SearchFilter)}
                placeholder='City'
                disabled
                value={inputValue || ''}
              />
              <TouchableOpacity onPress={onLocationChangeHandler} activeOpacity={0.8} style={styles.inputBtn} />
            </View>
          }
          {!isDrawPlaceholderHidden && isActiveDraw &&
            <View style={styles.drawPlaceholderWrap}>
              <View style={styles.drawPlaceholderContainer}>
                <DrawPlaceholderIcon style={styles.drawPlaceholderIcon} />
                <Text style={styles.drawPlaceholderText}>Draw area on map</Text>
              </View>
            </View>
          }
          {!isActiveDraw &&
            <View>
              <CircleButton onPress={() => navigation.navigate(Routes.PropertiesList)} icon={ListIcon} styleBtn={styles.listBtn} />
              <View style={styles.listBtnBadge}>
                <Text style={styles.listBtnBadgeText}>{propertiesCount || '0'}</Text>
              </View>
            </View>
          }
        </View>
        {isAreaBtnVisible && (
          <View style={styles.areaBtnWrap}>
            <TouchableOpacity onPress={handleSearchInArea} activeOpacity={0.8} style={styles.areaBtn}>
              <Text style={styles.areaBtnText}>SEARCH IN THIS AREA</Text>
            </TouchableOpacity>
          </View>
        )}
        {!isActiveDraw &&
        <View style={styles.sideBtnsWrap}>
          <CircleButton
            styleBtn={[styles.sideBtn, { backgroundColor: modePolygon || isActiveDraw ? Colors.primaryBlack : Colors.white }]}
            iconStyles={styles.sideBtnIcon}
            icon={modePolygon || isActiveDraw ? DrawCancelIcon : DrawOnMapIcon}
            onPress={!modePolygon ? handleIsDraw : () => handlePolygonRemoveAlert(handleRemovePolygon)}
          />
          <CircleButton styleBtn={styles.sideBtn} iconStyles={styles.locationBtnIcon} icon={CurrentLocationIcon} onPress={onCurrentLocationHandler} />
        </View>
}
        {isPopUpVisible && <HelpPopUp onFinish={onPopUpSubmit} />}
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[255, 0]}
        initialSnap={1}
        borderRadius={0}
        renderContent={renderSheetContent}
        enabledInnerScrolling={true}
        onCloseEnd={handleSheetClose}
        enabledGestureInteraction={sliderProperties?.length > 0 ? false : true}
      />
      {isSearchLoading &&
        <Preloader />
      }
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Layout.window.height,
  },
  map: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    flex: 1,
  },
  inputsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 50 : 16,
    paddingHorizontal: 16,
  },
  listBtn: {
    width: 46,
    height: 46,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    shadowColor: 'rgba(67, 137, 235, 0.1)',
    shadowOpacity: 1,
    borderRadius: 10,
  },
  listBtnBadge: {
    position: 'absolute',
    backgroundColor: Colors.secondaryGreen,
    top: -5,
    alignSelf: 'center',
    paddingHorizontal: 3,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 10,
    shadowColor: 'rgba(61, 82, 136, 0.2)',
    shadowOpacity: 1,
    borderRadius: 9,
  },
  listBtnBadgeText: {
    ...TextStyles.smallBody,
    color: Colors.white,
    fontWeight: '500',
  },
  sideBtnsWrap: {
    position: 'absolute',
    right: 16,
    bottom: TAB_BAR_HEIGHT + 24,
    zIndex: 100,
  },
  locationIcon: {
    marginRight: 4,
  },
  sideBtn: {
    width: 48,
    height: 48,
    marginTop: 16,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5,
    shadowColor: 'rgba(23, 32, 52, 0.08)',
    shadowOpacity: 1,
  },
  sideBtnIcon: {
    width: 30,
    height: 30,
  },
  locationBtnIcon: {
    width: 18,
    height: 18,
    marginLeft: -2,
  },
  searchInputWrap: {
    width: '83%',
    height: 46,
  },
  searchInput: {
    width: '100%',
    height: '100%',
  },
  inputBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '80%',
    height: '100%',
  },
  propertyCard: {
    alignSelf: 'center',
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  markerText: {
    ...TextStyles.h5,
    alignSelf: 'center',
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.white,
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    zIndex: 2,
  },
  areaBtnWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 76,
    alignSelf: 'center',
  },
  areaBtn: {
    width: Platform.OS === 'ios' ? 160 : '100%',
    height: 38,
    textAlign: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5,
    shadowColor: 'rgba(23, 32, 52, 0.08)',
    shadowOpacity: 1,
  },
  areaBtnText: {
    ...TextStyles.btnTitle,
    color: Colors.primaryBlack,
    fontSize: 13,
  },
  drawPlaceholderWrap: {
    width: '100%',
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 8.43478
    },
    shadowRadius: 21.087,
    shadowColor: 'rgba(67, 137, 235, 0.1)',
    shadowOpacity: 1,
    borderRadius: 20,
  },
  drawPlaceholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawPlaceholderIcon: {
    width: 33,
    height: 35,
  },
  drawPlaceholderText: {
    ...TextStyles.h5,
    marginLeft: 16,
  },
  bottomSheet: {
    width: '100%',
    alignItems: 'center',
    overflow: 'visible',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    elevation: 55,
  },
  bottomSheetSlider: {
    paddingTop: 22,
  },
  closeSliderBtn: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.primaryBlack,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 5,
    top: 0,
  },
  closeSliderIcon: {
    width: 20,
    height: 20,
  },
});
