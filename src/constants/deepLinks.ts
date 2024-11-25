export const domallyDynamicLink = 'https://domally.page.link';
export const propertyDetailsLink = `https://domally.page.link/EwdR/`;
const WEBSITE_URL = 'https://domally.com/property';

export const getPropertyDetailsLink = (propertyId: number) => {
  const url = new URL(propertyDetailsLink);
  url.searchParams.append('propertyId', propertyId.toString());

    const deeplink = `${domallyDynamicLink}/?link=${encodeURIComponent(url.toString())}&ifl=${WEBSITE_URL}?propertyId=${propertyId.toString()}&afl=${WEBSITE_URL}?propertyId=${propertyId.toString()}&ofl=${WEBSITE_URL}?propertyId=${propertyId.toString()}`;
    return deeplink;
};
