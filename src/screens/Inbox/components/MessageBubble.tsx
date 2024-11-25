import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import { Bubble, Message } from 'react-native-gifted-chat';
import Layout from 'src/constants/Layout';

interface Props {
  p: Message['props'];
}

const MessageBubble = (p: Message['props']) => (
  <Bubble
    {...p}
    wrapperStyle={{
      left: [styles.bubbleWrap, { backgroundColor: Colors.white, borderBottomLeftRadius: p?.currentMessage?.quickReplies?.values ? 16 : 0 }],
      right: [styles.bubbleWrap, { backgroundColor: Colors.primaryBlue, borderBottomRightRadius: p?.currentMessage?.quickReplies?.values ? 16 : 0 }],
    }}
    textStyle={{ left: [styles.bubbleText, { color: Colors.primaryBlack }], right: [styles.bubbleText, { color: Colors.white }] }}
    containerToPreviousStyle={{ left: { borderTopLeftRadius: 16 }, right: { borderTopRightRadius: 16 } }}
  />
);

const styles = StyleSheet.create({
  bubbleWrap: {
    maxWidth: Layout.getViewWidth(81.3),
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
  },
  bubbleText: {
    ...TextStyles.body2,
    lineHeight: 17,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
  },
});

export default MessageBubble;
