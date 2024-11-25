export default interface IStorage {
  getValue(key: string): Promise<string>;
  setValue(key: string, value: string): Promise<void>;

  hasValue(key: string): Promise<boolean>;
  remove(key: string): Promise<void>;

  clearAllData: () => void;
}

export interface IStorageSync {
  getValue(key: string): string;
  setValue(key: string, value: string): void;

  removeValue(key: string): boolean;
  hasValue(key: string): boolean;

  clearAllData: () => Promise<void>;
}
