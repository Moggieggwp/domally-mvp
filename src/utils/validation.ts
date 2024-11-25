export function isEmail(value: string): string | undefined {
  return !!value.match('^.+\\@\\S+\\.\\S+$') ? undefined : 'Email is not valid';
}

export const passwordsMatch = (value: string, password: string): any =>
  value !== password ? 'Password must be match' : undefined;

export const emailRegex = new RegExp('^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$','i');
