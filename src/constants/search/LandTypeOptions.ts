import { ImageSourcePropType } from 'react-native';
import { LandType } from 'src/types';

const campgrounds = require('src/assets/img/land/campgrounds.png');
const environmental = require('src/assets/img/land/environmental.png');
const feedlot = require('src/assets/img/land/feedlot.png');
const mobileHomePark = require('src/assets/img/land/mobile-home-park.png');
const ruralLand = require('src/assets/img/land/rural-land.png');
const vacantLand = require('src/assets/img/land/vacant-land.png');
const special = require('src/assets/img/special.png');

export type LandOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: LandType;
};

export const OPTIONS: LandOption[] = [
  {
    title: 'Vacant Land',
    iconUrl: vacantLand,
    type: 'vacant_land',
  },
  {
    title: 'Rural Land',
    iconUrl: ruralLand,
    type: 'rural_land',
  },
  {
    title: 'Campgrounds',
    iconUrl: campgrounds,
    type: 'campgrounds',
  },
  {
    title: 'Mobile Home Park',
    iconUrl: mobileHomePark,
    type: 'mobile_home_park',
  },
  {
    title: 'Environmental Land',
    iconUrl: environmental,
    type: 'environmental',
  },
  {
    title: 'Feedlot',
    iconUrl: feedlot,
    type: 'feedlot',
  },
  {
    title: 'Special',
    iconUrl: special,
    type: 'special',
  },
];
