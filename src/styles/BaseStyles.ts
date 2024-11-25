import { StyleSheet } from 'react-native';
import { hasNotch } from 'src/constants/devices';
import Layout from 'src/constants/Layout';
import Typography from './Typography';

export const TextStyles = Typography;
export const notch = hasNotch();
export const layout = Layout;

const BaseStyles = StyleSheet.create({
  flexStart: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexCenterTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  flexCenterBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default BaseStyles;
