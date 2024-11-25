import React from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';
import { Avatar, Message } from 'react-native-gifted-chat';
import { CachedImage } from 'react-native-img-cache';
import { defaultAvatarRectangle } from 'src/screens/Profile/assets';

interface ChatAvatarProps {
  p: Message['props'];
  render: boolean;
  onPressAvatar: () => void;
}

const ChatAvatar = (props: ChatAvatarProps) => {
  const { p, render, onPressAvatar } = props;

  const androidAvatar = (): JSX.Element => (
    <View
      style={[
        styles.avatarContainer,
        {
          borderRadius: 15,
          position: 'relative',
        },
      ]}
    >
      <Image style={[styles.avatarContainer, styles.avatarBackgroundImage]} source={defaultAvatarRectangle} />
      <CachedImage style={[styles.avatarContainer, { zIndex: -1, borderRadius: 15 }]} source={{ uri: `${p.currentMessage.user.avatar}` }} />
    </View>
  );

  const avatar = Platform.OS === 'ios' ? p.currentMessage.user.avatar : androidAvatar;

  return (
    <Avatar
      {...p}
      currentMessage={{
        ...p.currentMessage,
        user: {
          ...p.currentMessage.user,
          avatar: avatar || defaultAvatarRectangle,
        },
      }}
      containerStyle={{
        left: [styles.avatarContainer, { marginRight: 8, opacity: +render }],
        right: [styles.avatarContainer, { marginLeft: 8, opacity: +render }],
      }}
      textStyle={styles.avatarText}
      imageStyle={{ left: styles.avatarImage, right: styles.avatarImage }}
      onPressAvatar={onPressAvatar}
    />
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginRight: 0,
    marginLeft: 0,
    width: 30,
    height: 30,
  },
  avatarText: {
    fontSize: 14,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarBackgroundImage: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -100,
    borderRadius: 15,
  },
});

export default ChatAvatar;
