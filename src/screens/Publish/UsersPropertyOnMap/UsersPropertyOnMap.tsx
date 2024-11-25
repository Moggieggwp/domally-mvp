import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import { Page, BackButton } from 'src/components';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Layout from 'src/constants/Layout';
import { Property, PropertyStatus } from 'src/types';
import { useSelector } from 'react-redux';
import { properties } from 'src/redux/selectors/usersProperties';
import Colors from 'src/constants/colors';
import { getStatusIcon } from 'src/utils/propertyStatusHelper';
import mapStyles, { mapMarkersClustersStyles as mapMarkersStyles } from 'src/styles/MapStyles';
import { convertToLatLng } from 'src/utils/locationHelper';

import MarkerWrapImage from 'src/assets/img/marker-wrap.svg';

const DEFAULT_PADDING = { top: 150, right: 100, bottom: 150, left: 100 };

const LATITUDE_DELTA = 0.14;
const LONGITUDE_DELTA = LATITUDE_DELTA * (Layout.window.width / Layout.window.height);

const INITIAL_REGION: Region = {
  latitude: 37.72825,
  longitude: -122.4324,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

type Props = {
  navigation: StackNavigationProp<RootStackParamsList>;
};

const UsersPropertyOnMap = (props: Props) => {
  const { navigation } = props;
  const [propertiesList, setPropertiesList] = useState<Property[]>(null);
  const usersProperties = useSelector(properties);
  const mapRef = useRef(null);

  useEffect(() => {
    if (usersProperties) {
      const properties = usersProperties.filter(p => p.status !== PropertyStatus.NOT_COMPLETED);
      setPropertiesList(properties);
    }
  }, [usersProperties]);

  const renderMarkers = useMemo(() => {
    if (!propertiesList?.length) return null;

    return propertiesList.map(p => {
      const Icon = getStatusIcon(p.status);
      return <Marker
        key={p.id}
        identifier={p.id.toString()}
        pinColor={'transparent'}
        tracksViewChanges={false}
        coordinate={{
          longitude: p.location?.coords?.lon,
          latitude: p.location?.coords?.lat,
        }}
      >
        <View style={mapMarkersStyles.marker}>
          <MarkerWrapImage />
          <Text style={mapMarkersStyles.markerTitle}>
            ${p.price.value}
          </Text>
          <Icon width={18} height={18} style={mapMarkersStyles.markerIcon} />
        </View>
      </Marker>
    })
  }, [propertiesList]);

  const fitAllMarkers = async () => {
    if (!propertiesList?.length) return;

    await mapRef.current.fitToCoordinates(
      propertiesList?.map(p => convertToLatLng(p.location.coords)),
      { edgePadding: DEFAULT_PADDING },
    );
  };

  const renderCluster = cluster => {
    if (!propertiesList?.length) return;

    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;
    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
        tracksViewChanges={false}
      >
       <View style={mapMarkersStyles.clusterWrap}>
         <Text style={mapMarkersStyles.clusterText}>{points}</Text>
       </View>
     </Marker>
    );
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <BackButton onPress={() => navigation.goBack()} style={styles.backButton} />
      <MapView
        mapRef={ref => { mapRef.current = ref }}
        style={mapMarkersStyles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyles}
        initialRegion={INITIAL_REGION}
        loadingEnabled={Platform.OS === 'android'}
        onLayout={fitAllMarkers}
        renderCluster={renderCluster}
        showsBuildings={false}
        pitchEnabled={false}
        showsCompass={false}
        showsIndoors={false}
        zoomTapEnabled={false}
        rotateEnabled={false}
      >
        {propertiesList?.length !== 0 && renderMarkers}
      </MapView>
    </Page>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
  },
  backButton: {
    position: 'absolute',
    top: Layout.isMediumDevice ? Layout.getViewHeight(3.9) : Layout.getViewHeight(6.8),
    left: 16,
    zIndex: 10,
    elevation: 10,
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});

export default UsersPropertyOnMap;
