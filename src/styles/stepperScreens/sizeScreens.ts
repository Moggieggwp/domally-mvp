import { StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { TextStyles } from '../BaseStyles';

export const sizeScreenStyle = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
  },
  btnWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: 151,
    height: 50,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnTitle: {
    ...TextStyles.btnTitle,
    color: Colors.primaryBlack,
    textTransform: 'uppercase',
  },
  activeBtnTitle: {
    color: Colors.white,
  },
  activeBtn: {
    backgroundColor: Colors.primaryBlack,
  },
  rangeSliderWrap: {
    width: '100%',
    marginTop: 92,
  },
  rangeTextWrap: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rangeText: {
    color: Colors.primaryBlue,
  },
  supStyle: {
    color: Colors.primaryBlack,
    paddingBottom: 10,
    fontSize: 13,
    lineHeight: 15,
  },
});
