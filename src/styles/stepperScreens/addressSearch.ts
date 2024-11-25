import { Platform, StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import { fontRegular } from 'src/styles/Typography';

export const autocompleteStyles = StyleSheet.create({
  container: {
    position: 'relative', 
    zIndex: 500,
  },
  textInputContainer: { 
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 17,
  },
  listView: {
    backgroundColor: Colors.white,
    marginTop: 0,
    position: 'absolute',
    left: 0,
    top: 12,
    elevation: 20,
  },
  row: {
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 8,
    margin: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 38,
    zIndex: 500,
  },
  separator: {
    backgroundColor: Colors.gray,
    width: '100%',
    height: 1,
    borderRadius: 100,
  },
  description: {
    fontFamily: fontRegular,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.typography.thinLabel,
    zIndex: 500,
  },
});
