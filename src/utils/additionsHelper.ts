export function convertToMap<T>(obj: {[key: string]: boolean }) {
    if (!obj) return null;
    return new Map(Object.entries(obj));
};

export function convertMapToObject<T>(mapObj: Map<T, boolean>): {[key: string]: boolean } {
    if (!mapObj) return null;
    return Object.fromEntries(mapObj);
};