import StorageAsync from 'src/services/Storage';
import Storage from 'src/services/Storage';
import { MeasureCurrency, MeasureSquare } from 'src/types';
import { SearchData } from 'src/types';
import {
  ONBOARDING_COMPLETED,
  MAIN_ONBOARDING_COMPLETED,
  ACCESS_TOKEN,
  CURRENCY_DEFAULT_SETTING,
  SQUARE_DEFAULT_SETTING,
  SEARCH_DATA,
} from './storageKeys';

export async function setOnboardingCompleted() {
  const isOnboardCompleted = await getIsOnboardCompleted();

  if (!isOnboardCompleted) {
    await Storage.setValue(ONBOARDING_COMPLETED, 'true');
  }
}

export async function getIsOnboardCompleted() {
  return await Storage.getValue(ONBOARDING_COMPLETED);
}

export async function setMainOnboardingCompleted() {
  const isMainOnboardCompleted = await getIsMainOnboardCompleted();

  if (!isMainOnboardCompleted) {
    await Storage.setValue(MAIN_ONBOARDING_COMPLETED, 'true');
  }
}

export async function getIsMainOnboardCompleted() {
  return await Storage.getValue(MAIN_ONBOARDING_COMPLETED);
}

export async function clearStorage() {
  return await Storage.clearAllData();
}

export async function getLocalAccessToken() {
  return await Storage.getValue(ACCESS_TOKEN);
}

export async function getMetrics(): Promise<{currency: MeasureCurrency, square: MeasureSquare}> {
  const currencyLocal = await StorageAsync.getValue(CURRENCY_DEFAULT_SETTING) as MeasureCurrency;
  const squareLocal = await StorageAsync.getValue(SQUARE_DEFAULT_SETTING) as MeasureSquare;

  return {
    currency: currencyLocal || MeasureCurrency.CAD,
    square: squareLocal || MeasureSquare.SQFT,
  }
};

export async function getLocalSearchData() {
  return await Storage.getValue(SEARCH_DATA);
}

export async function setLocalSearchData(searchData: SearchData) {
  if (!searchData) return;

  await Storage.setValue(SEARCH_DATA, JSON.stringify(searchData));
}
