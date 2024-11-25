import React, { FunctionComponent } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Image,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  Text,
  View,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import FastImage from 'react-native-fast-image';

type Props = {
  onPress: (index: number | string) => void;
  styleWrap?: StyleProp<ViewStyle>;
  styleBtn?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title?: string;
  iconUrl?: ImageSourcePropType;
  iconStyles?: StyleProp<ImageStyle>;
  isActive?: boolean;
  icon?: FunctionComponent<SvgProps>;
  index?: number | string;
  iconUri?: string;
};

export default function CircleButton(props: Props) {
  const { onPress, iconUri, iconUrl, iconStyles, isActive, title, styleWrap, titleStyle, styleBtn, index, icon } = props;

  const onPressHandler = () => {
    if (onPress) {
      onPress(index);
    }
  };

  const cardActiveStyles = isActive ? styles.activeBtn : {};
  const cardActiveTitleStyles = isActive ? Colors.primaryBlue : Colors.primaryBlack;

  return (
    <View style={[styles.btnWrap, styleWrap]}>
      <TouchableOpacity onPress={onPressHandler} activeOpacity={0.8} style={[styles.btn, cardActiveStyles, styleBtn]}>
        {iconUrl ? <Image style={[styles.icon, iconStyles]} source={iconUrl} /> : null}
        {iconUri &&
          <FastImage
            style={styles.icon}
            source={{
              uri: iconUri,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        }
        {icon ? <props.icon style={[styles.icon, iconStyles]} /> : null}
      </TouchableOpacity>
      {title && (
        <Text style={[TextStyles.btnTitle, styles.title, { color: cardActiveTitleStyles }, titleStyle]}>{title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 80,
    resizeMode: 'cover',
  },
  activeBtn: {
    borderWidth: 2,
    borderColor: Colors.circleBtn.activeBorder,
    shadowColor: Colors.circleBtn.activeShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  btn: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.circleBtn.defaultBg,
    borderRadius: 90,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
  },
});
