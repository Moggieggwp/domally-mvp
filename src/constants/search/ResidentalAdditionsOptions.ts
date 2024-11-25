import { ResidentialAdditions } from 'src/types';

export type ResidentialAddition = {
  title: ResidentialAdditions;
};

export const OPTIONS: ResidentialAddition[] = [
  {
    title: 'basement',
  },
  {
    title: 'attic',
  },
  {
    title: 'garage',
  },
  {
    title: 'shed',
  },
];
