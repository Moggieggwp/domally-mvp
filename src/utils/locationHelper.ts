import { LatLng, Region } from 'react-native-maps';
import { ILocationProps } from 'src/screens/Search/Search/components/maps/types';
import { Coords } from 'src/types';
import * as GEO from 'geolib';
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';

export function convertToLatLng(coords: Coords): LatLng {
  if (!coords) return;
  return {
    latitude: coords.lat,
    longitude: coords.lon,
  };
}

export function convertToCoords(coords: false | ILocationProps): Coords {
  if (!coords) return;
  return {
    lat: coords.latitude,
    lon: coords.longitude,
  };
}

export function convertCoordsToLatLng(polygon: Coords[]): LatLng[] {
  if (!polygon?.length) return [];
  return polygon.map((p) => convertToLatLng(p));
}

export function convertLatLngToCoords(coords: LatLng[]): Coords[] {
  if (!coords?.length) return [];

  return coords.map((p) => convertToCoords(p));
}

export function convertCenterToViewportPolygon(center: Coords, latitudeDelta: number, longitudeDelta: number) {
  if (!center || !latitudeDelta || !longitudeDelta) return null;

  const halfLatDelta = latitudeDelta / 2;
  const halfLonDelta = longitudeDelta / 2;

  const result: Coords[] = [
    {
      lat: center.lat + halfLatDelta,
      lon: center.lon - halfLonDelta,
    },
    {
      lat: center.lat + halfLatDelta,
      lon: center.lon + halfLonDelta,
    },
    {
      lat: center.lat - halfLatDelta,
      lon: center.lon + halfLonDelta,
    },
    {
      lat: center.lat - halfLatDelta,
      lon: center.lon - halfLonDelta,
    },
    {
      lat: center.lat + halfLatDelta,
      lon: center.lon - halfLonDelta,
    },
  ];

  return result;
}

export function convertBoundariesToRegion(boundaries: { northEast: LatLng; southWest: LatLng }): Region {
  const northeastLat = boundaries.northEast.latitude;
  const northeastLon = boundaries.northEast.longitude;
  const southwestLat = boundaries.southWest.latitude;
  const southwestLon = boundaries.southWest.longitude;

  const latDelta = northeastLat - southwestLat;
  const lngDelta = northeastLon - southwestLon;

  return {
    latitude: northeastLat - latDelta / 2,
    longitude: northeastLon - lngDelta / 2,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}

export function convertRegionToPolygon(region: Region): Coords[] {
  if (!region) return null;
  const halfLatDelta = region.latitudeDelta / 2;
  const halfLonDelta = region.longitudeDelta / 2;

  const result: Coords[] = [
    {
      lat: region.latitude + halfLatDelta,
      lon: region.longitude - halfLonDelta,
    },
    {
      lat: region.latitude + halfLatDelta,
      lon: region.longitude + halfLonDelta,
    },
    {
      lat: region.latitude - halfLatDelta,
      lon: region.longitude + halfLonDelta,
    },
    {
      lat: region.latitude - halfLatDelta,
      lon: region.longitude - halfLonDelta,
    },
    {
      lat: region.latitude + halfLatDelta,
      lon: region.longitude - halfLonDelta,
    },
  ];

  return result;
}

export const calculatedCenterPolygon = (coordinates: ILocationProps[]): Promise<false | ILocationProps> => {
  return Promise.resolve(GEO.getCenter(coordinates));
};

export const getPolygonCenter = async (polygon: LatLng[]) => {
  return await calculatedCenterPolygon(polygon);
};

export const convertCoordsToNumbersArray = (coords: Coords[]) => {
  if (!coords?.length) return [];
  const result = coords.map((c) => [c.lon, c.lat]);
  return [result];
};

// the structure of polygon array is Array<Array<Array<number>>>
export const convertNumbersArrayToCoords = (coordsArray: any[]): Coords[] => {
  if (!coordsArray?.length) return [];
  const result: Coords[] = coordsArray[0].map((c) => {
    return {
      lat: c[1],
      lon: c[0],
    };
  });

  return result;
};

export type DetailedPlace = {
  streetNumber: string;
  address: string;
  city: string;
  administrativeAreaName: string; // state, county, or province
  detailedAddress: string;
};

type AddressComponent = Array<{long_name: string; short_name: string; types: string[]}>

export const getPlaceDetails = (placeDetails: GooglePlaceDetail): DetailedPlace => {
  const place = placeDetails.address_components;
  const result = convertDetails(place);
  return result;
};


export const getCurrentLocationDetails = (placeDetails: Geocoder.GeocoderResponse): DetailedPlace => {
  const place = placeDetails.results[0].address_components;
  const result = convertDetails(place);
  return result;
};

const convertDetails = (addressComponent: AddressComponent): DetailedPlace => {
  const result = {} as DetailedPlace;
  for (let i = 0; i < addressComponent.length; i++) {
    const types = addressComponent[i].types;

    if (types.includes('locality')) {
      result.city = addressComponent[i].long_name;
    }

    if (types.includes('street_number')) {
      result.streetNumber = addressComponent[i].long_name;
    }

    if (types.includes('route')) {
      result.address = addressComponent[i].long_name;
    }

    if (types.includes('administrative_area_level_1')) {
      result.administrativeAreaName = addressComponent[i].short_name;
    }
  }

  result.detailedAddress = `${result.streetNumber || ''} ${result.address || ''} ${result.city || ''} ${result.administrativeAreaName || ''}`;
  return result;
};