import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

type BottomSheetProps = {
  sheetRef: React.MutableRefObject<BottomSheetContainer>;
  title?: string;
  onClose: () => void;
  isActive: boolean;
  onOutsidePress?: () => void;
  snapPoints?: number[];
  containerStyle?: StyleProp<ViewStyle>;
  childrenContainerStyle?: StyleProp<ViewStyle>;
  dividerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  initialSnap?: number;
  showBg: boolean;
};

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  sheetRef,
  title,
  onClose,
  isActive,
  onOutsidePress,
  snapPoints,
  containerStyle,
  childrenContainerStyle,
  dividerStyle,
  initialSnap,
  showBg,
  titleStyle,
}) => (
  <>
    <BottomSheetContainer
      ref={sheetRef}
      snapPoints={snapPoints || [213, -5]}
      initialSnap={initialSnap || 1}
      onCloseEnd={onClose}
      enabledBottomClamp
      enabledGestureInteraction={false}
      renderContent={() => (
        <View style={[styles.bottomSheet, containerStyle]}>
          <View style={[styles.divider, dividerStyle]} />
          {title && (
            <View style={styles.sheetTitleContainer}>
              <Text style={[styles.sheetTitleText, titleStyle]}>{title}</Text>
            </View>
          )}
          <View style={[styles.sheetContainer, childrenContainerStyle]}>{children}</View>
        </View>
      )}
    />
    {isActive && showBg && (
      <View style={styles.darkBackground}>
        <TouchableOpacity style={styles.darkBackgroundBtn} activeOpacity={1} onPress={onOutsidePress} />
      </View>
    )}
  </>
);

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    alignItems: 'center',
    overflow: 'visible',
    height: 198,
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 5,
    shadowColor: 'rgba(14, 20, 56, 0.04)',
    shadowOpacity: 1,
    marginTop: 15,
  },
  divider: {
    position: 'absolute',
    top: 9,
    width: 32,
    height: 4,
    backgroundColor: Colors.darkGray,
    opacity: 0.6,
    borderRadius: 64,
    alignSelf: 'center',
  },
  sheetContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    width: '100%',
  },
  textWrap: {
    marginTop: 12,
    textAlign: 'center',
  },
  sheetTitleContainer: {
    borderBottomWidth: 1,
    width: '100%',
    marginTop: 20,
    borderBottomColor: Colors.gray,
  },
  sheetTitleText: {
    alignSelf: 'center',
    textAlign: 'center',
    ...TextStyles.h5,
    color: Colors.primaryBlack,
    marginBottom: 10,
  },
  darkBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  darkBackgroundBtn: {
    width: '100%',
    height: '100%',
  },
});
