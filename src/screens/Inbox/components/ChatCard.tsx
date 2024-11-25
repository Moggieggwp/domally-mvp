import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ImageSourcePropType, Image, TouchableHighlight, View, Text, Platform } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import Swipeable from 'react-native-swipeable';
import Checkbox from 'src/components/CheckBox';

import PinnedIcon from 'src/assets/img/icons/pin-flag-icon-blue.svg';
import MuteIconDark from 'src/assets/img/icons/mute-icon-dark.svg';

import PinFlagIcon from 'src/assets/img/icons/pin-flag-icon.svg';
import UnpinFlagIcon from 'src/assets/img/icons/unpin-flag-icon.svg';
import MuteIcon from 'src/assets/img/icons/mute-icon.svg';
import UnmuteIcon from 'src/assets/img/icons/unmute-icon.svg';
import DeleteIcon from 'src/assets/img/icons/trash-icon.svg';
import moment from 'moment';
import { defaultAvatarRectangle } from 'src/screens/Profile/assets';
import { CachedImage } from 'react-native-img-cache';

export type ChatCardProps = {
  id: string;
  name: string;
  propertyLocation: string;
  avatarUrl: ImageSourcePropType;
  pinned: boolean;
  muted: boolean;
  showCheckbox: boolean;
  lastMessageTime: string;
  unreaded: number;
  onPress: () => void;
  onCheckboxChangeCb: (chatId: string) => void;
  handleDelete: (data) => void;
  handlePin: (data) => void;
  handleUnpin: (data) => void;
  handleMute: (data) => void;
  handleUnMute: (data) => void;
};

const ChatCard = (props: ChatCardProps) => {
  const {
    id,
    name,
    propertyLocation,
    avatarUrl,
    pinned,
    muted,
    showCheckbox,
    lastMessageTime,
    unreaded,
    onPress,
    onCheckboxChangeCb,
    handleDelete,
    handleUnpin,
    handlePin,
    handleMute,
    handleUnMute,
  } = props;
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!showCheckbox) {
      setCheckboxChecked(false);
    }
  }, [showCheckbox]);

  useEffect(() => {
    return () => {
      setCheckboxChecked(false);
    };
  }, []);

  const onCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
    onCheckboxChangeCb(id);
  };

  const getUnreadedCount = () => {
    if (unreaded > 0) {
      return unreaded;
    }

    return null;
  };

  const onPin = (data) => {
    pinned ? handleUnpin(data) : handlePin(data);
    ref.current.recenter();
  };

  const onMute = (data) => {
    muted ? handleUnMute(data) : handleMute(data);
    ref.current.recenter();
  };

  const onDelete = (data) => {
    handleDelete(data);
    ref.current.recenter();
  };

  const getLastMessageDate = () => {
    const messageDate = moment(lastMessageTime);
    const isToday = messageDate.isSame(new Date(), 'day');

    const isWithinAWeek = messageDate.isSame(new Date(), 'week');

    if (isToday) {
      return messageDate.format('hh:mm a');
    } else if (isWithinAWeek) {
      return messageDate.format('ddd');
    }

    return messageDate.format('DD.MM.YY');
  };

  const swipeableButtons = [
    <TouchableHighlight style={[styles.swipeableButton, { backgroundColor: Colors.gray }]} onPress={onPin} underlayColor={Colors.grayLight}>
      <>
        {pinned ? <UnpinFlagIcon width={24} height={24} style={styles.swipeableButtonIcon} /> : <PinFlagIcon width={24} height={24} style={styles.swipeableButtonIcon} />}
        <Text style={[TextStyles.body3, { color: Colors.primaryBlack }]}>{pinned ? 'Unpin' : 'Pin'}</Text>
      </>
    </TouchableHighlight>,
    <TouchableHighlight style={[styles.swipeableButton, { backgroundColor: Colors.primaryBlue }]} onPress={onMute} underlayColor={Colors.lightBlue}>
      <>
        {muted ? <UnmuteIcon width={24} height={24} style={styles.swipeableButtonIcon} /> : <MuteIcon width={24} height={24} style={styles.swipeableButtonIcon} />}
        <Text style={[TextStyles.body3, { color: Colors.white }]}>{muted ? 'Unmute' : 'Mute'}</Text>
      </>
    </TouchableHighlight>,
    <TouchableHighlight style={[styles.swipeableButton, { backgroundColor: Colors.red }]} onPress={onDelete} underlayColor={Colors.redLight}>
      <>
        <DeleteIcon width={24} height={24} style={styles.swipeableButtonIcon} />
        <Text style={[TextStyles.body3, { color: Colors.white }]}>Delete</Text>
      </>
    </TouchableHighlight>,
  ];

  return (
    <Swipeable
      rightButtons={swipeableButtons}
      rightButtonWidth={64}
      ref={ref}
      swipeReleaseAnimationConfig={{
        useNativeDriver: false,
        toValue: {
          x: 0,
          y: 0,
        },
      }}
    >
      <TouchableHighlight
        style={[styles.chatCard, pinned ? { backgroundColor: Colors.defaultBg } : null]}
        onPress={showCheckbox ? onCheckboxChange : onPress}
        underlayColor={pinned ? Colors.defaultBg : 'transparent'}
      >
        <>
          {showCheckbox && <Checkbox checked={checkboxChecked} style={styles.checkbox} onChange={onCheckboxChange} />}

          {avatarUrl ? (
            Platform.OS === 'ios' ? (
              <Image
                style={styles.chatCardAvatar}
                source={{
                  uri: avatarUrl,
                  cache: 'reload',
                }}
              />
            ) : (
              <CachedImage source={{ uri: avatarUrl }} mutable style={styles.chatCardAvatar} />
            )
          ) : (
            <Image style={styles.chatCardAvatar} source={defaultAvatarRectangle} />
          )}
          <View style={styles.chatCardText}>
            <View style={styles.nameWrap}>
              <Text numberOfLines={2} style={styles.name}>
                {propertyLocation}
              </Text>
              {pinned && <PinnedIcon width={16} height={16} style={styles.chatCardIcon} />}
              {muted && <MuteIconDark width={16} height={16} style={styles.chatCardIcon} />}
            </View>
            <Text style={[TextStyles.thinBody]} numberOfLines={2}>
              {name}
            </Text>
          </View>
          <View style={styles.chatCardInfo}>
            <Text style={[TextStyles.h6, styles.lastTime]}>{getLastMessageDate()}</Text>
            <View style={getUnreadedCount() ? styles.msgsNumberWrap : styles.msgsWitoutNumberWrap}>
              <Text style={[TextStyles.h6, styles.msgsNumber]}>{getUnreadedCount()}</Text>
            </View>
          </View>
        </>
      </TouchableHighlight>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  chatCard: {
    width: '100%',
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.gray,
  },
  chatCardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 10,
  },
  chatCardText: {
    flexShrink: 1,
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...TextStyles.body2,
    color: Colors.primaryBlack,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
    marginRight: 4,
    maxWidth: 220,
  },
  chatCardIcon: {
    marginRight: 4,
    marginTop: -7,
  },
  chatCardInfo: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  lastTime: {
    color: Colors.primaryBlue,
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 7,
  },
  msgsNumberWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primaryBlue,
  },
  msgsWitoutNumberWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'transparent',
  },
  msgsNumber: {
    color: Colors.white,
  },
  swipeableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 64,
  },
  swipeableButtonIcon: {
    marginBottom: 4,
  },
  swipeableButtonText: {
    fontSize: 14,
    lineHeight: 18,
  },
  checkbox: {
    marginRight: 10,
  },
});

export default ChatCard;
