import React from 'react';
import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import mapStyles from 'src/styles/MapStyles';

type MapProps = MapViewProps & {
  style?: StyleProp<ViewStyle>;
  children?: any;
  mapRef?: React.LegacyRef<MapView>;
};

function Map(props: MapProps) {
  const { style, mapRef } = props;

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={[styles.map, style]}
      customMapStyle={mapStyles}
      {...props}
    >
      {props.children}
    </MapView>
  )
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
});

export default Map;
