import React from 'react';
import { Keyboard, StyleSheet, ViewStyle, StyleProp, KeyboardAvoidingView, Platform } from 'react-native';

import { safeCall } from 'src/utils/functions';

import BackButton from './BackButton';
import CloseButton from './CloseButton';
import Preloader from './Preloader';

import Layout from 'src/constants/Layout';
import Colors from 'src/constants/colors';

export type PageProps = {
  style?: StyleProp<ViewStyle>;
  inProgress?: boolean;
  keyboardAvoidingEnabled: boolean;
  onBack?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
};

function wrapWithKeyboardDismiss(cb: () => void) {
  return () => {
    Keyboard.dismiss();
    safeCall(cb);
  };
}

export default class Page extends React.Component<PageProps> {
  render() {
    const { children, style, onBack, onClose, keyboardAvoidingEnabled, isLoading } = this.props;

    const _onBack = onBack && wrapWithKeyboardDismiss(onBack);
    const _onClose = onClose && wrapWithKeyboardDismiss(onClose);

    return (
      <KeyboardAvoidingView style={[styles.base, style]} enabled={keyboardAvoidingEnabled} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        {isLoading ? <Preloader /> : null}
        {onBack ? <BackButton onPress={_onBack} style={styles.backButton} /> : null}
        {onClose ? <CloseButton onPress={_onClose} style={styles.closeButton} /> : null}
        {children}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: Colors.pageBg,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (Layout.isMediumDevice ? Layout.getViewHeight(3.5) : Layout.getViewHeight(5.4)) : 16,
    left: 14,
    zIndex: 10,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? Layout.getViewHeight(5.2) : 16,
    left: 14,
    zIndex: 10,
    elevation: 10,
  },
});
