import { ProjectColorsSchema } from './shape';

const Colors: ProjectColorsSchema = {
  white: '#FFFFFF',
  black: '#000000',
  gray: '#EEF1FA',
  graySecondary: '#F6F9FE',
  darkGray: '#9C9EAD',
  grayLight: '#ECF3FD',
  redLight: '#f56767',
  red: '#F95757',
  green: '#32D74B',
  secondaryGreen: '#68CA87',
  primaryBlue: '#4389EB',
  primaryBlack: '#1B1E25',
  lightBlue: '#4791FA',
  defaultBg: '#F8F9FD',
  defaultText: '#595861',
  shadowColor: 'rgba(14, 20, 56, 0.06)',
  primaryBlack01: 'rgba(27, 30, 37, 0.1)',

  // ========== TYPOGRAPHY ==============

  typography: {
    h1: '#1B1E25',
    h2: '#1B1E25',
    h3: '#1B1E25',
    h4: '#1B1E25',
    h5: '#000000',
    thinLabel: '#7B7D89',
    btnTitle: '#FFFFFF',
    ghostBtn: '#4389EB',
    body1: '#595861',
    body2: '#595861',
    body3: '#1B1E25',
    textBtn: '#595861',
    smallBody: '#000000',
  },

  // ========== COMPONENTS ==============

  button: {
    defaultBg: '#4389EB',
    defaultUnderlayColor: '#4389EB',
    defaultTextColor: '#FFFFFF',
    ghostBtnColor: '#4389EB',
    primaryUnderlayColor: 'rgba(67, 137, 235, 0.5)',
    secondaryUnderlayColor: 'rgba(248, 249, 253, 0.5)',
  },

  // ========== Screens ==============

  pageBg: '#FFFFFF',

  splash: {
    gradientColor1: '#EEF1FA',
    gradientColor2: '#F8F9FD',
  },

  userDetails: {
    gradientColor1: 'rgba(27, 30, 37, 0.6)',
    gradientColor2: 'rgba(27, 30, 37, 0.003125)',
  },

  switch: {
    bgColor: '#EEF1FA',
  },

  input: {
    validColor: '#4389EB',
    invalidColor: '#F95757',
    border: '#EEF1FA',
    text: '#1B1E25',
  },

  checkBox: {
    borderColor: '#595861',
    checkedBg: '#4389EB',
  },

  checkBoxButton: {
    checkedText: '#1B1E25',
    defaultText: '#595861',
    defaultBg: '#F8F9FD',
    checkedBg: '#FFFFFF',
  },

  searchInput: {
    bg: '#ffffff',
    border: '#EEF1FA',
    focusedBorder: '#4389EB',
  },

  circleBtn: {
    defaultBg: '#F6F9FE',
    activeBorder: '#4389ebcc',
    activeShadow: '#1D62CA',
  },

  chatInput: {
    sendBtnBg: '#4389EB',
    border: '#9C9EAD',
  },

  iconBtn: {
    shadow: 'rgba(29, 98, 202, 0.18)',
    border: 'rgba(67, 137, 235, 0.2)',
  },

  radioBtn: {
    checked: '#4389EB',
    border: '#9C9EAD',
  },
};

export default Colors;
