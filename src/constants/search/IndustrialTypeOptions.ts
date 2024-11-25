import { ImageSourcePropType } from 'react-native';
import { IndustrialType } from 'src/types';

const coldStorageBuildings = require('src/assets/img/industrial/cold-storage-buildings.png');
const dataCenter = require('src/assets/img/industrial/data-center.png');
const flexBuildings = require('src/assets/img/industrial/flex-buildings.png');
const manufacturing = require('src/assets/img/industrial/manufacturing.png');
const warehouse = require('src/assets/img/industrial/warehouse.png');
const special = require('src/assets/img/special.png');

export type IndustrialOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: IndustrialType;
};

export const OPTIONS: IndustrialOption[] = [
  {
    title: 'Warehouse Buildings',
    iconUrl: warehouse,
    type: 'warehouse_buildings',
  },
  {
    title: 'Manufacturing Buildings',
    iconUrl: manufacturing,
    type: 'manufacturing_buildings',
  },
  {
    title: 'Cold Storage Buildings',
    iconUrl: coldStorageBuildings,
    type: 'cold_storage_buildings',
  },
  {
    title: 'Data Centers',
    iconUrl: dataCenter,
    type: 'data_centers',
  },
  {
    title: 'Flex Buildings',
    iconUrl: flexBuildings,
    type: 'flex_buildings',
  },
  {
    title: 'Special',
    iconUrl: special,
    type: 'special',
  },
];
