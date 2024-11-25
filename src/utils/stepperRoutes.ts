import { Action, PropertyType, Property } from 'src/types';
import * as Routes from 'src/constants/routes';
import { CommercialData } from 'domally-utils';

export function getStepperRoute(goal: Action, propertyType: PropertyType) {
  switch (goal) {
    case 'Buy':
      return getBuyPropertyRoute(propertyType);
    case 'Sell':
      return getSellPropertyRoute(propertyType);
    case 'Rent':
      return getBuyPropertyRoute(propertyType);
    case 'Rent-Out':
      return getSellPropertyRoute(propertyType);
    default:
      return Routes.SignIn;
  }
}

function getBuyPropertyRoute(type: PropertyType) {
  switch (type) {
    case 'Residential':
      return Routes.BuyResidentialStepper;
    case 'Land':
      return Routes.BuyLandStepper;
    case 'Industrial':
      return Routes.BuyIndustrialStepper;
    case 'Commercial':
      return Routes.BuyCommercialStepper;
    default:
      return Routes.BuyResidentialStepper;
  }
}

export function getSellPropertyRoute(type: PropertyType) {
  switch (type) {
    case 'Residential':
      return Routes.SellResidentialStepper;
    case 'Land':
      return Routes.SellLandStepper;
    case 'Industrial':
      return Routes.SellIndustrialStepper;
    case 'Commercial':
      return Routes.SellCommercialStepper;
    default:
      return Routes.SellResidentialStepper;
  }
}

export function getPropertyEditInitialStep(property: Property): number {
  switch (property.type) {
    case 'Residential':
      return residentialEditStep(property);
    case 'Land':
      return landEditStep(property);
    case 'Industrial':
      return industrialEditStep(property);
    case 'Commercial':
      return commercialEditStep(property);
    default:
      return null;
  }
}

function residentialEditStep(property: Property): number {
  if (!property.residentialData) {
    return 2;
  }

  if (!property.size) {
    return 3;
  }

  if (!property.virtualShowings) {
    return 4;
  }

  if (!property.location?.address) {
    return 5;
  }

  if (!property.zoningCode) {
    return 6;
  }

  if (!property.description) {
    return 7;
  }

  if (!property.price) {
    return 8;
  }

  if (!property.defaultPhoto || !property.photos) {
    return 9;
  }

  return 9;
}

function landEditStep(property: Property): number {
  if (!property.size) {
    return 2;
  }

  if (!property.virtualShowings) {
    return 3;
  }

  if (!property.location?.address) {
    return 4;
  }

  if (!property.zoningCode) {
    return 5;
  }

  if (!property.description) {
    return 6;
  }

  if (!property.price) {
    return 7;
  }

  if (!property.defaultPhoto || !property.photos) {
    return 8;
  }

  return 8;
}

function industrialEditStep(property: Property): number {
  if (!property.size) {
    return 2;
  }

  if (!property.virtualShowings) {
    return 3;
  }

  if (!property.location?.address) {
    return 4;
  }

  if (!property.zoningCode) {
    return 5;
  }

  if (!property.description) {
    return 6;
  }

  if (!property.price) {
    return 7;
  }

  if (!property.defaultPhoto || !property.photos) {
    return 8;
  }

  return 8;
}

function commercialEditStep(property: Property): number {
  console.log(isCommercialDataEmpty(property.commercialData))
  if (isCommercialDataEmpty(property.commercialData)) {
    return 2;
  }

  if (!property.size) {
    return 3;
  }

  if (!property.virtualShowings) {
    return 4;
  }

  if (!property.location?.address) {
    return 5;
  }

  if (!property.zoningCode) {
    return 6;
  }

  if (!property.description) {
    return 7;
  }

  if (!property.price) {
    return 8;
  }

  if (!property.defaultPhoto || !property.photos) {
    return 9;
  }

  return 9;
};


function isCommercialDataEmpty(commercialData: CommercialData): boolean {
  if (!commercialData) return true;
  return Object.values(commercialData).every(item => item === null);
};
