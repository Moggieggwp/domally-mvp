import { StyleSheet } from 'react-native';
import Layout from 'src/constants/Layout';

export const commonScreensStyles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
    overflow: 'visible',
    paddingLeft: 0,
    paddingRight: 0,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 1,
    paddingBottom: 170,
    paddingLeft: 87,
    paddingRight: 87,
  },
});

export const commonTypesScreenStyles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
    overflow: 'visible',
    paddingLeft: 32,
    paddingRight: 32,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
    zIndex: 1,
    paddingBottom: 170,
  },
  circleButton: {
    marginBottom: 21,
  },
  circleTitle: {
    maxWidth: 90,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
