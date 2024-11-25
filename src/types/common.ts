import { Types, MeasureRatesDto } from 'domally-utils';

export type Action = Types.PropertyAction;

export type PropertyType = Types.PropertyType;

export type PropertyTypeHeader = Types.PropertyAction;

export type NumberOfBedrooms = Types.NumberOfBedrooms;

export type NumberOfBathrooms = Types.NumberOfBathrooms;

export type NumberOfFloors = Types.NumberOfFloors;

export type NumberOfSpots = Types.NumberOfSpots;

// For the commercial search: Number of units, Number of commercial units, Number of residential units
export type NumberOfUnits = Types.NumberOfUnits;

export type ResidentialAdditions = Types.ResidentialAdditions;

export type CommercialAdditions = Types.CommercialAdditions;

export type IndustrialType = Types.IndustrialType;

export type LandType = Types.LandType;

export type CommercialType = Types.CommercialType;

export type ResidentialType = Types.ResidentialType;

export type RangeValue = Types.RangeValue;

export type Range = Types.Range;

export type Coords = Types.Coords;

export type Location = Types.Location;

export type PropertyDetailedType = Types.PropertyDetailedType;

export type ActionType = {
  type: string | symbol | number;
  payload?: any;
  error?: any;
};

export type UsersFeedback = {
  invitedFrom: string;
  feedback: string;
};

export enum MeasureCurrency {
  CAD = 'cad',
  USD = 'usd',
};

export enum MeasureSquare {
  SQM = 'sqm',
  SQFT = 'sqft',
};

export type RangeValueDefault = {
  min: number;
  max: number;
};

export type AppMetrics = {
  square: MeasureSquare;
  currency: MeasureCurrency;
};

export type MeasureRates = MeasureRatesDto;
