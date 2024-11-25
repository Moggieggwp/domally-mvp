import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  Text,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import InfoIcon from 'src/assets/img/icons/info-icon.svg';
import ActiveInfoIcon from 'src/assets/img/icons/active-info-icon.svg';

type Props = {
  onPress: () => void;
  iconUrl: ImageSourcePropType;
  title: string;
  style?: StyleProp<ViewStyle>;
  isSmall?: boolean;
  isActive?: boolean;
  index?: number;
  onInfoPress?: (index: number) => void;
};

export default function ChooseActionCard(props: Props) {
  const { onPress, title, iconUrl, isActive, style, onInfoPress, index, isSmall } = props;
  const cardBorderColor = isActive ? Colors.primaryBlue : Colors.gray;
  const borderWidth = isActive ? 2 : 1;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.card,
        isSmall ? styles.smallCard : styles.largeCard,
        { borderColor: cardBorderColor, borderWidth: borderWidth },
        style,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, isSmall ? styles.smallIconWrap : styles.largeIconWrap]}>
        {iconUrl ? <Image style={[styles.image]} source={iconUrl} /> : null}
      </View>
      <View style={styles.textWrap}>
        <Text style={[TextStyles.cardTitle1]}>{title}</Text>
      </View>
      {onInfoPress && (
        <TouchableOpacity onPress={() => onInfoPress(index)} style={[styles.infoIconWrap]}>
          {isActive ? <ActiveInfoIcon style={styles.image} /> : <InfoIcon style={styles.image} />}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2,
  },
  smallCard: {
    height: 80,
  },
  largeCard: {
    height: 116,
  },
  iconWrap: {
    borderRadius: 16,
    marginLeft: 12,
  },
  smallIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  largeIconWrap: {
    width: 112,
    height: 92,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textWrap: {
    marginLeft: 14,
  },
  infoIconWrap: {
    position: 'absolute',
    right: 31,
    alignSelf: 'center',
    width: 18,
    height: 18,
    zIndex: 10,
    elevation: 10,
  },
});
