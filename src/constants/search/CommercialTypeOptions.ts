import { ImageSourcePropType } from 'react-native';
import { CommercialType } from 'src/types';

const multiFamily = require('src/assets/img/commercial/multi-family.png');
const farmBuildings = require('src/assets/img/commercial/farm-buildings.png');
const hospitality = require('src/assets/img/commercial/hospitality.png');
const educationalFacility = require('src/assets/img/commercial/educational-facility.png');
const office = require('src/assets/img/commercial/office.png');
const publicWorship = require('src/assets/img/commercial/public-worship.png');
const retailFacility = require('src/assets/img/commercial/retail-facility.png');
const storageBuildings = require('src/assets/img/commercial/storage-buildings.png');
const special = require('src/assets/img/special.png');

export type CommercialOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: CommercialType;
};

export const OPTIONS: CommercialOption[] = [
  {
    title: 'Multi Family Building',
    iconUrl: multiFamily,
    type: 'multi_family_building'
  },
  {
    title: 'Retail Facility',
    iconUrl: retailFacility,
    type: 'retail_facility',
  },
  {
    title: 'Educational Facility',
    iconUrl: educationalFacility,
    type: 'educational_facility',
  },
  {
    title: 'Public Worship',
    iconUrl: publicWorship,
    type: 'public_worship',
  },
  {
    title: 'Hospitality',
    iconUrl: hospitality,
    type: 'hospitality',
  },
  {
    title: 'Office',
    iconUrl: office,
    type: 'office',
  },
  {
    title: 'Storage Buildings',
    iconUrl: storageBuildings,
    type: 'storage_buildings'
  },
  {
    title: 'Farm Buildings',
    iconUrl: farmBuildings,
    type: 'farm_buildings',
  },
  {
    title: 'Special',
    iconUrl: special,
    type: 'special',
  },
];
