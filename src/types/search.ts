import { SearchDto } from 'domally-utils';

export type SearchData = Partial<SearchDto>;

export enum SearchType {
  COUNT = 'count',
  LIST = 'list',
  MAP = 'map',
}

export type BottomSheetAdditionOptions = [
  {
    title: string;
    value: undefined;
  },
  {
    title: string;
    value: boolean;
  },
  {
    title: string;
    value: boolean;
  },
];

export enum PolygonSearchType {
  CUSTOM = 'custom',
  VIEWPORT = 'viewport',
}
