import { NavigationContainerRef } from '@react-navigation/native';
import queryString from 'query-string';
import * as React from 'react';
import { propertyDetailsLink } from 'src/constants/deepLinks';
import * as Routes from 'src/constants/routes';

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function handleDeepLink(link) {
  if (!link) {
    return;
  }
  const url = link.url;
  switch (url.split('?')[0]) {
    case propertyDetailsLink:
      {
        const parsedUrl = queryString.parseUrl(url);
        navigationRef.current?.navigate(Routes.PropertyDetails, { propertyId: parseInt(parsedUrl.query.propertyId.toString(), 10) });
      }
    default:
      return null;
  }
}