import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IMessage, Reply } from 'react-native-gifted-chat';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

import Layout from 'src/constants/Layout';
import { ScheduleTourRequestMessage } from './ScheduleTour';
import QuickReplies from './QuickReplies';
import { ScheduleTourData, TourType } from 'src/types/chat';
import moment from 'moment';

export interface PropertyData {
  imageUrl: string;
  price: string;
  square: string;
  street: string;
  bedrooms: number;
  bathrooms: number;
  distanceFromCenter: string;
  date: string;
}

interface ChatPropertyCardProps {
  data: PropertyData;
  message: IMessage;
  replies: Reply[];
  onReply: (msgs?: IMessage[]) => void;
  scheduleTourData?: ScheduleTourData;
  disableScheduleTour?: boolean;
}

const ChatPropertyCard = (props: ChatPropertyCardProps) => {
  const { replies, onReply, message, disableScheduleTour } = props;

  const { scheduleTourData } = message;

  const scheduleTourRequestMessage =
    scheduleTourData.type === TourType.Offline
      ? `Can I please, have an onsite property viewing on ${moment(scheduleTourData.fromDate).format('DD-MM-YYYY')} at time ${moment(scheduleTourData.fromDate).format('hh:mm A')}.`
      : `Can I please, have an online property viewing on a ${scheduleTourData.platform} and my phone number is ${scheduleTourData.phone} on ${moment(
          scheduleTourData.fromDate,
        ).format('DD-MM-YYYY')} at time ${moment(scheduleTourData.fromDate).format('hh:mm A')}`;

  return (
    <View style={styles.propertyCardWrap}>
      <ScheduleTourRequestMessage message={scheduleTourRequestMessage} />
      <QuickReplies disableScheduleTour={disableScheduleTour} replies={replies} message={message} onReply={onReply} />
    </View>
  );
};

const styles = StyleSheet.create({
  propertyCardWrap: {
    flexDirection: 'column',
  },
  propertyCard: {
    width: Layout.getViewWidth(81.3),
    maxHeight: 135,
    borderRadius: 16,
    padding: 11,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  propertyCardImageWrap: {
    width: Layout.getViewWidth(26.9),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  propertyCardImage: {
    minWidth: '100%',
    minHeight: '100%',
  },
  propertyCardTextWrap: {
    position: 'relative',
    width: 169,
    alignItems: 'flex-start',
  },
  propertyCardPrice: {
    ...TextStyles.h4,
    marginBottom: 4,
  },
  propertyCardParamsWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  propertyCardParam: {
    width: 'auto',
    alignItems: 'center',
    flexDirection: 'row',
  },
  propertyCardStreet: {
    ...TextStyles.h6,
    color: Colors.defaultText,
    marginBottom: 2,
  },
  propertyCardParamIcon: {
    marginRight: 7,
  },
  propertyCardParamText: {
    ...TextStyles.h6,
    color: Colors.defaultText,
  },
  propertyCardRouteIcon: {
    marginRight: 4,
  },
  propertyCardRouteText: {
    ...TextStyles.thinBody,
    color: Colors.defaultText,
  },
  propertyCardParamDate: {
    ...TextStyles.thinBody,
    marginBottom: 0,
    marginTop: 'auto',
  },
  squareSign: {
    ...TextStyles.body3,
    color: Colors.defaultText,
    fontSize: 8,
    lineHeight: 10,
    marginBottom: 10,
  },
});

export default ChatPropertyCard;
