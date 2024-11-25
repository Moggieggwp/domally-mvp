import { Action } from 'src/types';

export function convertSearchAction(action: Action): Action {
  switch (action) {
    case 'Buy':
      return 'Sell';
    case 'Rent':
      return 'Rent-Out';
    default:
      return 'Sell';
  }
};

export function reverseConvertSearchAction(action: Action): Action {
  switch (action) {
    case 'Sell':
      return 'Buy';
    case 'Rent-Out':
      return 'Rent';
    default:
      return 'Buy';
  }
};