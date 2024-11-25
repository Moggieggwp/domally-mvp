import { RangeValueDefault } from 'src/types';

export const getSliderRangeMax = (range: RangeValueDefault): number => {
  if (!range) return;
  const { min, max } = range;
  // We have to add 0.001 to prevent the range slider component from collapsing
  const maxValue = min === max ? max + 0.001 : max;

  return maxValue;
};
