import IStorage from 'src/types/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageAsync: IStorage = {
  getValue(key: string): Promise<string> {
    return AsyncStorage.getItem(key);
  },

  setValue(key: string, value: string): Promise<void> {
    if (!key) {
      throw new Error('[StorageAsync] key must be not empty! got:' + key);
    }
    if (!value) {
      throw new Error("[StorageAsync] value must be not null! use 'remove' instead. Got: " + `${key} | ${value}`);
    }

    return AsyncStorage.setItem(key, value);
  },

  async hasValue(key: string): Promise<boolean> {
    try {
      const value = await StorageAsync.getValue(key);
      return !!value;
    } catch (err) {
      return false;
    }
  },

  remove(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  },

  clearAllData(): void {
    AsyncStorage.getAllKeys()
        .then(keys => {
          console.log(keys, '__keys to remove')
          AsyncStorage.multiRemove(keys)
        })
  },
};

export default StorageAsync;
