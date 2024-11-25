export type ProjectColorsSchema = {
  // ========== TYPOGRAPHY ==============
  white: string;
  black: string;
  gray: string;
  graySecondary: string;
  darkGray: string;
  grayLight: string;
  redLight: string;
  red: string;
  primaryBlue: string;
  lightBlue: string;
  primaryBlack: string;
  green: string;
  secondaryGreen: string;
  defaultBg: string;
  defaultText: string;
  shadowColor: string;
  primaryBlack01: string;

  typography: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    thinLabel: string;
    btnTitle: string;
    body1: string;
    body2: string;
    body3: string;
    smallBody: string;
    ghostBtn: string;
    textBtn: string;
  };
  // ========== SCREENS: start ==============

  pageBg: string;

  splash: {
    gradientColor1: string;
    gradientColor2: string;
  };

  userDetails: {
    gradientColor1: string;
    gradientColor2: string;
  };

  // ========== SCREENS: end ==============

  // ========== COMPONENTS: start ==============

  button: {
    defaultBg: string;
    defaultUnderlayColor: string;
    defaultTextColor: string;
    ghostBtnColor: string;
    primaryUnderlayColor: string;
    secondaryUnderlayColor: string;
  };

  switch: {
    bgColor: string;
  };

  input: {
    validColor: string;
    invalidColor: string;
    border: string;
    text: string;
  };

  checkBox: {
    borderColor: string;
    checkedBg: string;
  };

  checkBoxButton: {
    checkedText: string;
    defaultText: string;
    defaultBg: string;
    checkedBg: string;
  };

  searchInput: {
    bg: string;
    border: string;
    focusedBorder: string;
  };

  circleBtn: {
    defaultBg: string;
    activeBorder: string;
    activeShadow: string;
  };

  chatInput: {
    sendBtnBg: string;
    border: string;
  };

  iconBtn: {
    shadow: string;
    border: string;
  };

  radioBtn: {
    checked: string;
    border: string;
  };

  // ========== COMPONENTS: end ==============
};
