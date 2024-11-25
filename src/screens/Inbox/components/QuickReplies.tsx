import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { IMessage, Reply } from 'react-native-gifted-chat';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

interface QuickRepliesProps {
  replies: Reply[];
  message: IMessage;
  disableScheduleTour: boolean;
  onReply: (msgs?: IMessage[]) => void;
}
type TMessage = IMessage & { approved: any };
const QuickReplies = (props: QuickRepliesProps) => {
  const { replies, onReply, message, disableScheduleTour } = props;

  const status = message.scheduleTourData.status;

  if (status !== 'PENDING') {
    return (
      <View style={styles.repliesWrap}>
        <TouchableOpacity key={message._id} style={[styles.quickReply, { backgroundColor: status === 'ACCEPT' ? Colors.primaryBlue : Colors.primaryBlack }]} disabled>
          <Text style={{ ...TextStyles.body2, color: Colors.white }}>{status === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (disableScheduleTour) {
    return null;
  }
  return (
    <View style={styles.repliesWrap}>
      {replies.map((r, i) => {
        const msg: TMessage = {
          _id: message._id,
          text: r.title,
          approved: r.value,
          user: {
            _id: message.user._id,
            name: message.user.name,
          },
          createdAt: message.createdAt,
        };
        const isEven = i % 2 === 0;

        return (
          <TouchableOpacity
            key={r.value}
            style={[styles.quickReply, { backgroundColor: isEven ? Colors.primaryBlue : Colors.primaryBlack }]}
            onPress={(_e) => onReply([msg])}
          >
            <Text style={{ ...TextStyles.body2, color: Colors.white }}>{r.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  repliesWrap: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  quickReply: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 22,
    paddingVertical: 11,
    margin: 0,
    borderRadius: 100,
    marginRight: 8,
  },
});

export default QuickReplies;
