import { useFocusEffect } from '@react-navigation/core';
import { useCallback, useEffect, useRef } from 'react';
import { DependencyList, EffectCallback } from 'react';
import { BackHandler, Platform } from 'react-native';

export default function useDidUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export function usePrevious<T>(value): T {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useBackButtonListener() {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
}