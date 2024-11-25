import React from 'react';
import { View, StyleSheet } from 'react-native';

import { IMessage, Message } from 'react-native-gifted-chat';
import { ScheduleTourData } from 'src/types/chat';
import ChatAvatar from './ChatAvatar';
import ChatDay from './ChatDay';
import ChatPropertyCard, { PropertyData } from './ChatPropertyCard';
import MessageBubble from './MessageBubble';

interface ChatMessageProps {
  p: Message['props'];
  onReply: (msgs?: IMessage[]) => void;
  onPressAvatar: () => void;
  scheduleTourData?: ScheduleTourData;
  disableScheduleTour?: boolean;
}

export const propertyMock: PropertyData = {
  imageUrl: 'https://reactjs.org/logo-og.png',
  distanceFromCenter: '5 mins',
  bedrooms: 3,
  bathrooms: 2,
  date: 'Sep 13, 2021',
  street: '704 McGar St',
  square: '4,236 ft',
  price: '$43,684',
};

const ChatMessage = (props: ChatMessageProps) => {
  const { p, onReply, onPressAvatar, scheduleTourData, disableScheduleTour } = props;

  const { currentMessage, position } = p;
  const leftSide = position === 'left';
  const rightSide = position === 'right';

  return (
    currentMessage && (
      <View>
        <ChatDay {...p} />
        <View style={[styles[position].container]}>
          <ChatAvatar p={p} render={leftSide} onPressAvatar={onPressAvatar} />
          {currentMessage.quickReplies?.values ? (
            <ChatPropertyCard
              data={propertyMock}
              message={currentMessage}
              replies={currentMessage.quickReplies?.values}
              onReply={onReply}
              scheduleTourData={scheduleTourData}
              disableScheduleTour={disableScheduleTour}
            />
          ) : (
            <MessageBubble {...p} />
          )}
          <ChatAvatar p={p} render={rightSide} onPressAvatar={null} />
        </View>
      </View>
    )
  );
};

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 16,
      marginRight: 0,
      marginBottom: 8,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 16,
      marginBottom: 8,
    },
  }),
};

export default ChatMessage;
