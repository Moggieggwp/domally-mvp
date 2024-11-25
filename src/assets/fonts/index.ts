export type FontsSet = {
  'Font-Light': NodeRequire;
  'Font-Medium': NodeRequire;
  'Font-Regular': NodeRequire;
  'Font-SemiBold': NodeRequire;
};

const FontsLibrary: () => FontsSet = () => ({
  'Font-Light': require('./Gilroy-Light.otf'),
  'Font-Medium': require('./Gilroy-Medium.otf'),
  'Font-Regular': require('./Gilroy-Regular.otf'),
  'Font-SemiBold': require('./Gilroy-SemiBold.otf'),
});

export const ProjectFonts = FontsLibrary();
