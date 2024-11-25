import { StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { TextStyles } from '../BaseStyles';

export const squareScreenStyle = StyleSheet.create({
    contentContainer: {
      width: '100%',
      paddingTop: Layout.getViewHeight(3.2),
    },
    content: {
      paddingLeft: 16,
      overflow: 'hidden',
      paddingBottom: 20,
    },
    keyboardView: {
      flex: 1,
    },
    generalInputWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 16,
    },
    title: {
      maxWidth: 80,
    },
    input: {
      maxWidth: 88,
    },
    squareItem: {
      height: 68,
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
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
    addBtn: {
      marginTop: 10,
      flexDirection: 'row',
      alignSelf: 'center',
      width: 'auto',
    },
    addBtnTitle: {
      color: Colors.primaryBlue,
      marginLeft: 9,
    },
    bottomSheet: {
      width: '100%',
      alignItems: 'center',
      overflow: 'visible',
      backgroundColor: 'transparent',
      paddingTop: 22,
      elevation: 55,
      zIndex: 25,
    },
    bottomSheetContainer: {
      height: '100%',
      width: '100%',
      backgroundColor: Colors.white,
      borderRadius: 24,
      paddingTop: 22,
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowRadius: 5,
      shadowColor: 'rgba(14, 20, 56, 0.04)',
      shadowOpacity: 1,
    },
    sheetBtnWrap: {
      width: '100%',
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    sheetBtn: {
      width: '100%',
      marginHorizontal: 24,
      marginBottom: 65,
      marginTop: 50,
    },
    sheetTitle: {
      color: Colors.black,
      width: '100%',
      textAlign: 'center',
      fontWeight: '600',
      textTransform: 'capitalize'
    },
    modal: {
      height: '100%',
      width: '100%',
      backgroundColor: Colors.white,
      position: 'absolute',
      left: 0,
      bottom: 0,
      zIndex: 10,
      paddingTop: 60,
    },
    modalContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16,
    },
    supStyle: {
      color: Colors.primaryBlack,
      paddingBottom: 10,
      fontSize: 13,
      lineHeight: 15,
    },
  });
