import { ResidentialAdditionData, CommercialAdditionData } from 'src/types';

export enum CounterStringValues {
  NotApplicable = 'N/A',
  Any = 'Any',
}

export const residentialNumberOfBedrooms = ['N/A', '1+', '2+', '3+', '4+', '5+'];
export const residentialNumberOfBathrooms = ['N/A', '1+', '1.5+', '2+', '2.5+', '3+', '4+', '5+'];
export const residentialNumberOfFloors = ['1', '2', '3', '4+'];
export const residentialNumberOfSpots = ['N/A', '1', '2', '3', '4+'];

export const commercialNumberOfUnits = ['N/A', '1+', '2+', '3+', '4+', '5+'];

export const RESIDENTIAL_SEARCH_OPTIONS: ResidentialAdditionData = {
  basement: undefined,
  attic: undefined,
  garage: undefined,
  shed: undefined,
};

export const COMMERCIAL_SEARCH_OPTIONS: CommercialAdditionData = {
  basement: undefined,
  attic: undefined,
};
