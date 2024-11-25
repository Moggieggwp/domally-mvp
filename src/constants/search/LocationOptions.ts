import { Location } from 'src/types';

const calgary = require('src/assets/img/locations/calgary.png');
const edmonton = require('src/assets/img/locations/edmonton.png');
const gta = require('src/assets/img/locations/gta.png');
const halifax = require('src/assets/img/locations/halifax.png');
const london = require('src/assets/img/locations/london.png');
const montreal = require('src/assets/img/locations/montreal.png');
const ottawa = require('src/assets/img/locations/ottawa.png');
const regina = require('src/assets/img/locations/regina.png');
const saskatoon = require('src/assets/img/locations/saskatoon.png');
const vancouver = require('src/assets/img/locations/vancouver.png');
const victoria = require('src/assets/img/locations/victoria.png');
const winnipeg = require('src/assets/img/locations/winnipeg.png');

export type LocationOption = Location & {
  iconUrl: string;
};

export const OPTIONS: LocationOption[] = [
  {
    city: 'GTA',
    iconUrl: gta,
    address: null,
    coords: {
      lat: '43.638830778',
      lon: '-79.385665124',
    },
  },
  {
    iconUrl: ottawa,
    address: null,
    city: 'Ottawa',
    coords: {
      lat: '45.417',
      lon: '-75.7',
    },
  },
  {
    city: 'Calgary',
    iconUrl: calgary,
    address: null,
    coords: {
      lat: '51.044270',
      lon: '-114.062019',
    },
  },
  {
    city: 'Edmonton',
    iconUrl: edmonton,
    address: null,
    coords: {
      lat: '53.55014',
      lon: '-113.46871',
    },
  },
  {
    iconUrl: halifax,
    address: null,
    city: 'Halifax',
    coords: {
      lat: '44.64533',
      lon: '-63.57239',
    },
  },
  {
    iconUrl: london,
    address: null,
    city: 'London',
    coords: {
      lat: '42.98339',
      lon: '-81.23304',
    },
  },
  {
    iconUrl: montreal,
    address: null,
    city: 'Montreal',
    coords: {
      lat: '45.505331312',
      lon: '-73.55249779',
    },
  },
  {
    iconUrl: regina,
    address: null,
    city: 'Regina',
    coords: {
      lat: '50.452831522',
      lon: '-104.603997584',
    },
  },
  {
    city: 'Saskatoon',
    iconUrl: saskatoon,
    address: null,
    coords: {
      lat: '52.11679',
      lon: '-106.63452',
    },
  },
  {
    iconUrl: vancouver,
    address: null,
    city: 'Vancouver',
    coords: {
      lat: '49.24966',
      lon: '-123.11934',
    },
  },
  {
    iconUrl: victoria,
    address: null,
    city: 'Victoria',
    coords: {
      lat: '48.43294',
      lon: '-123.3693',
    },
  },
  {
    iconUrl: winnipeg,
    address: null,
    city: 'Winnipeg',
    coords: {
      lat: '49.8844',
      lon: '-97.14704',
    },
  },
];