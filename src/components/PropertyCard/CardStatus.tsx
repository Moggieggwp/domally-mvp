import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, View, Text } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import { PropertyStatus } from 'src/types';
import { getStatusColor, getStatusIcon, getStatusTitle } from 'src/utils/propertyStatusHelper';

import ViewsIcon from 'src/assets/img/icons/property-details/views-icon.svg';
import CallsIcon from 'src/assets/img/icons/property-details/calls-icon.svg';
import LikesIcon from 'src/assets/img/icons/property-details/likes-icon.svg';
import ReviewsIcon from 'src/assets/img/icons/property-details/reviews-icon.svg';

type Props = {
  style?: StyleProp<ViewStyle>;
  status: PropertyStatus;
  isDetailsVisible?: boolean;
};

export default function CardStatus(props: Props) {
  const { style, status, isDetailsVisible } = props;
  const Icon = getStatusIcon(status);
  const title = getStatusTitle(status);
  const statusColor = getStatusColor(status);

  return (
    <View style={[styles.statusWrap, style]}>
      <View style={styles.status}>
        <Icon width={32} height={32} style={styles.statusIcon} />
        <Text style={[TextStyles.body2, styles.statusText, { color: statusColor }]}>{title}</Text>
      </View>
      {isDetailsVisible && (
        <View style={styles.statWrap}>
          <View style={styles.statItem}>
            <ViewsIcon />
            <Text style={styles.statText}>0</Text>
          </View>
          <View style={styles.statItem}>
            <CallsIcon />
            <Text style={styles.statText}>0</Text>
          </View>
          <View style={styles.statItem}>
            <ReviewsIcon />
            <Text style={styles.statText}>0</Text>
          </View>
          <View style={styles.statItem}>
            <LikesIcon />
            <Text style={styles.statText}>0</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusWrap: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 32,
  },
  statusText: {
    marginLeft: 8,
    flexShrink: 1,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  statWrap: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  statItem: {
    marginLeft: 12.3,
    flexDirection: 'row',
  },
  statText: {
    ...TextStyles.body2,
    fontSize: 10,
    lineHeight: 12,
    color: Colors.darkGray,
    marginLeft: 5,
  },
});
