import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

import ScheduleTourIcon from 'src/assets/img/icons/schedule-tour.svg';
import Layout from 'src/constants/Layout';

interface ScheduleTourRequestMessageProps {
  message: string;
}

export const ScheduleTour = () => (
  <View style={styles.scheduleTour}>
    <ScheduleTourIcon width={24} height={24} />
    <Text style={styles.scheduleTourText}>Schedule tour</Text>
  </View>
);

export const ScheduleTourRequestMessage = (props: ScheduleTourRequestMessageProps) => (
  <View style={styles.scheduleTourWrap}>
    <ScheduleTour />
    <Text style={{ ...TextStyles.body2, color: Colors.primaryBlack }}>{props.message}</Text>
  </View>
);

const styles = StyleSheet.create({
  scheduleTourWrap: {
    alignItems: 'flex-start',
    width: Layout.getViewWidth(81.3),
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  scheduleTour: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  scheduleTourText: {
    ...TextStyles.body3,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.primaryBlue,
    marginLeft: 8,
  },
});
