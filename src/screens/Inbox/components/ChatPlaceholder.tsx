import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { TextStyles } from 'src/styles/BaseStyles';
import Layout from 'src/constants/Layout';

import chatPlaceholder from 'src/assets/img/chat-placeholder.png';

const ChatPlaceholder = () => (
  <View style={styles.placeholder}>
    <Image source={chatPlaceholder} style={styles.placeholderImage} />
    <Text style={[TextStyles.h2, styles.placeholderTitle]}>You don’t have any messages</Text>
    <Text style={TextStyles.body1}>Please send your first one</Text>
  </View>
);

const styles = StyleSheet.create({
  placeholder: {
    transform: [{ scaleY: -1 }],
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  placeholderImage: {
    width: Layout.getViewWidth(61),
    height: Layout.getViewWidth(61),
    marginBottom: 15,
  },
  placeholderTitle: {
    marginBottom: 12,
  },
});

export default ChatPlaceholder;
