import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export const useWithDispatch = (fn) => {
  const dispatch = useDispatch();

  return useCallback((...args) => dispatch(fn(...args)), []);
};
