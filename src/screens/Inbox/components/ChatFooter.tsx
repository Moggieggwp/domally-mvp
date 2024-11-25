import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import { ScheduleTour } from './ScheduleTour';

interface ChatFooterProps {
  onPress: () => void;
  disabled: boolean;
}

const ChatFooter = (props: ChatFooterProps) => (
  <TouchableOpacity onPress={props.onPress} style={styles.chatFooter}>
    {!props.disabled && <ScheduleTour />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chatFooter: {
    padding: 11,
    backgroundColor: Colors.defaultBg,
    borderRadius: 16,
    marginHorizontal: 'auto',
    marginBottom: 12,
    marginTop: 'auto',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default ChatFooter;
