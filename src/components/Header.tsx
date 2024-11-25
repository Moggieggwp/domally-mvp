import React from 'react';
import { Image, StyleProp, Platform, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import backArrow from '../assets/img/icons/backArrow.png';
import BackArrowWhite from '../assets/img/icons/back-arrow-white.svg';
import Layout from 'src/constants/Layout';

interface HeaderProps {
  onBack: () => void;
  arrowBack?: boolean;
  arrowBackWhite?: boolean;
  backText?: string;
  title: string | JSX.Element;
  headerOptions?: JSX.Element;
  headerContainerStyles?: StyleProp<ViewStyle>;
  rounded?: boolean;
}

const Header = (props: HeaderProps) => {
  const { arrowBack, backText, onBack, headerOptions, title, headerContainerStyles, arrowBackWhite, rounded } = props;

  const titleIsString = typeof title === 'string';

  return (
    <View style={[styles.header, headerContainerStyles && headerContainerStyles, rounded && styles.roundedStyles]}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.leftContainer} onPress={onBack}>
          <View style={styles.leftContainerView}>
            {arrowBack && <Image source={backArrow} />}
            {arrowBackWhite && <BackArrowWhite width={24} height={24} />}
            {backText && <Text style={[TextStyles.body2, { color: Colors.red }]}>{backText}</Text>}
          </View>
        </TouchableOpacity>
        {titleIsString ? (
          <Text style={styles.titleString} numberOfLines={1} ellipsizeMode='tail'>
            {title}
          </Text>
        ) : (
          title
        )}
        <View style={styles.rightContainer}>
          <View style={{ marginRight: 16 }}>{headerOptions && headerOptions}</View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 15,
    zIndex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 11,
    paddingBottom: 30,
  },
  titleString: {
    ...TextStyles.h3,
    textAlign: 'center',
    maxWidth: Layout.getViewWidth(58),
  },
  roundedStyles: {
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: Layout.getViewWidth(20.5),
  },
  leftContainerView: {
    marginLeft: 16,
    minWidth: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: Layout.isWideAndroid ? Layout.getViewWidth(21.5) : Layout.getViewWidth(22.5),
  },
  rightIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
});

export default Header;
