export function updateCopiedArray<T>(types: T[], type: T) {
  const copied = new Set(types);

  if (copied.has(type)) {
    copied.delete(type);
  } else {
    copied.add(type);
  }

  return [...copied];
};

