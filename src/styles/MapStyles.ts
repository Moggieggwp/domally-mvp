import { StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { TextStyles } from './BaseStyles';

const mapStyles = [
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d8e3f3',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#96b4df',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d8e3f3',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export const mapMarkersClustersStyles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerTitle: {
    ...TextStyles.h5,
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: '600',
  },
  markerIcon: {
    position: 'absolute',
    top: 3,
    alignSelf: 'center',
  },
  cluster: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5,
    shadowColor: 'rgba(23, 32, 52, 0.08)',
    shadowOpacity: 1,
    borderRadius: 16,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  clusterWrap: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5,
    shadowColor: 'rgba(23, 32, 52, 0.08)',
    shadowOpacity: 1,
    borderRadius: 16,
  },
  clusterText: {
    ...TextStyles.h5,
    fontWeight: '600',
  },
});

export default mapStyles;
