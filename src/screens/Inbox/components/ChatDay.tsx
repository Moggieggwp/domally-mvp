import React from 'react';
import { StyleSheet } from 'react-native';
import { Day, Message } from 'react-native-gifted-chat';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

const ChatDay = (p: Message['props']) => <Day {...p} textStyle={{ ...TextStyles.body3, color: Colors.darkGray }} containerStyle={styles.dayContainer} />;

const styles = StyleSheet.create({
  dayContainer: {
    marginTop: 10,
    marginBottom: 32,
  },
});

export default ChatDay;
