import { ImageSourcePropType } from 'react-native';
import { ResidentialType } from 'src/types';

const detached = require('src/assets/img/residential/detached.png');
const semiDetached = require('src/assets/img/residential/semi-detached.png');
const townhouse = require('src/assets/img/residential/townhouse.png');
const dupleSide = require('src/assets/img/residential/duple-side.png');
const duplexUpDown = require('src/assets/img/residential/duplex-up-down.png');
const multiFamilyTriple = require('src/assets/img/residential/multi-family-triple.png');
const multiFamilyFourplex = require('src/assets/img/residential/multi-family-fourplex.png');
const condoTownhouse = require('src/assets/img/residential/condo-townhouse.png');
const condoApartment = require('src/assets/img/residential/condo-apartment.png');
const mobileHome = require('src/assets/img/residential/mobile-home.png');
const special = require('src/assets/img/special.png');

export type ResidentialOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: ResidentialType;
};

export const OPTIONS: ResidentialOption[] = [
  {
    title: 'Detached',
    iconUrl: detached,
    type: 'detached',
  },
  {
    title: 'Semi-detached',
    iconUrl: semiDetached,
    type: 'semi_detached',
  },
  {
    title: 'Townhouse',
    iconUrl: townhouse,
    type: 'townhouse',
  },
  {
    title: 'Duplex Side By Side',
    iconUrl: dupleSide,
    type: 'duple_side',
  },
  {
    title: 'Duplex Up And Down',
    iconUrl: duplexUpDown,
    type: 'duplex_up_down',
  },
  {
    title: 'Multi Family Triplex',
    iconUrl: multiFamilyTriple,
    type: 'multi_family_triple',
  },
  {
    title: 'Multi Family Fourplex',
    iconUrl: multiFamilyFourplex,
    type: 'multi_family_fourplex',
  },
  {
    title: 'Condo Townhouse',
    iconUrl: condoTownhouse,
    type: 'condo_townhouse',
  },
  {
    title: 'Condo Apartment',
    iconUrl: condoApartment,
    type: 'condo_apartment',
  },
  {
    title: 'Mobile House',
    iconUrl: mobileHome,
    type: 'mobile_home',
  },
  {
    title: 'Special',
    iconUrl: special,
    type: 'special',
  },
];
