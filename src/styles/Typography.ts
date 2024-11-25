import { StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';

export const fontLight = 'Gilroy-Light';
export const fontMedium = 'Gilroy-Medium';
export const fontRegular = 'Gilroy-Regular';
export const fontSemiBold = 'Gilroy-SemiBold';

export const Typography = StyleSheet.create({
  h1: {
    fontFamily: fontSemiBold,
    fontSize: 28,
    lineHeight: 32,
    color: Colors.typography.h1,
  },

  h2: {
    fontFamily: fontSemiBold,
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 28,
    color: Colors.typography.h2,
  },

  h3: {
    fontFamily: fontSemiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.typography.h3,
  },

  h4: {
    fontFamily: fontSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.typography.h4,
  },

  h5: {
    fontFamily: fontMedium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.typography.h5,
  },

  h6: {
    fontFamily: fontMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: Colors.typography.h5,
  },

  body1: {
    fontFamily: fontRegular,
    fontSize: 16,
    lineHeight: 21,
    color: Colors.typography.body1,
  },

  body2: {
    fontFamily: fontRegular,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: Colors.typography.body2,
  },

  body3: {
    fontFamily: fontMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.typography.body3,
  },

  smallBody: {
    fontFamily: fontRegular,
    fontSize: 11,
    lineHeight: 14,
    color: Colors.typography.smallBody,
  },

  thinBody: {
    fontFamily: fontLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.typography.thinLabel,
  },

  logoLabel: {
    fontFamily: fontSemiBold,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.76,
    color: Colors.typography.h1,
  },

  btnTitle: {
    fontFamily: fontMedium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    color: Colors.typography.btnTitle,
  },

  ghostBtnTitle: {
    fontFamily: fontRegular,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.typography.ghostBtn,
  },

  cardTitle1: {
    fontFamily: fontMedium,
    fontSize: 18,
    lineHeight: 28,
    color: Colors.primaryBlack,
  },

  cardTitle2: {
    fontFamily: fontMedium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primaryBlack,
  },

  checkBoxTitle: {
    fontFamily: fontRegular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.primaryBlack,
    fontWeight: '400',
  },

  switchTitle: {
    fontFamily: fontMedium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primaryBlack,
  },

  textBtn: {
    fontFamily: fontRegular,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.typography.textBtn,
    fontWeight: '400',
  },
});

export default Typography;
