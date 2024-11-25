import React, { ReactNode, useEffect, useState } from 'react';
import { Image, LayoutChangeEvent, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import CloseIcon from 'src/assets/img/icons/close-icon.svg';
import { Button, Preloader } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { loadingSelector } from 'src/redux/selectors/app';
import { TextStyles } from 'src/styles/BaseStyles';
import QuestionContent from './PopupQuestionContent';

const windowImage = require('src/assets/img/window.png');
const successImage = require('src/assets/img/image_success.png');

const AnimatedView = Animated.View;

type HelpPopUpProps = {
  onFinish?: () => void;
};

const HelpPopUp = (props: HelpPopUpProps) => {
  const sheetHelpUsRef = React.useRef<BottomSheet>(null);
  const sheetQuestionRef = React.useRef<BottomSheet>(null);
  const sheetSuccessRef = React.useRef<BottomSheet>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isLoading = useSelector(loadingSelector);
  const [popupHeight, setPopupHeight] = useState(0);

  const fall = new Animated.Value(1);

  useEffect(() => {
    if (popupHeight) {
      showBottomSheetHelpUs();
    }
  }, [popupHeight]);

  const showBottomSheetHelpUs = () => {
    sheetHelpUsRef.current.snapTo(0);
    sheetQuestionRef.current.snapTo(1);
    sheetSuccessRef.current.snapTo(1);
  };

  const showBottomSheetQuestion = () => {
    setIsProcessing(true);
    sheetHelpUsRef.current.snapTo(1);
    sheetQuestionRef.current.snapTo(0);
  };

  const showBottomSheetSuccess = () => {
    sheetQuestionRef.current.snapTo(1);
    sheetSuccessRef.current.snapTo(0);
  };

  const onFinishHandler = () => {
    sheetSuccessRef.current.snapTo(1);
    props.onFinish?.();
    setIsProcessing(false);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setPopupHeight(height);
  };

  const renderSheetHelpUsContent = (): ReactNode => {
    return (
      <View style={[styles.bottomSheet]}>
        <View style={styles.divider} />
        <Image style={styles.imageHelp} source={windowImage} />
        <View>
          <Text style={[TextStyles.h2, styles.sheetTitle]}>Help us to become better</Text>
          <Text style={[TextStyles.body1, styles.desc]}>Please, provide us with your valuable response</Text>
          <TouchableOpacity activeOpacity={0} onPress={showBottomSheetQuestion} style={styles.buttonHelp}>
            <Text style={[TextStyles.body2, styles.textButton]}>Helps us make our service better</Text>
          </TouchableOpacity>
          <View style={styles.spacing52} />
        </View>
      </View>
    );
  };

  const renderSheetQuestionContent = () => (
    <QuestionContent
      onClose={() => {
        sheetQuestionRef.current.snapTo(1);
        props.onFinish?.();
        setIsProcessing(false);
      }}
      onSubmit={showBottomSheetSuccess}
    />
  );

  const renderSheetSuccessContent = (): ReactNode => {
    return (
      <View style={[styles.bottomSheet, styles.bottomSheetSuccess]}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.imageClose} onPress={onFinishHandler}>
          <CloseIcon />
        </TouchableOpacity>
        <Image style={styles.imageSuccess} source={successImage} />
        <Text style={TextStyles.h1}>Success</Text>
        <Text style={[TextStyles.body2, styles.successMsg]}>Thank you for sharing this with us, you’re helping us create a better product</Text>
        <View style={styles.spacing} />
        <Button title={'Got It'} style={styles.buttonGotIt} onPress={onFinishHandler} />
      </View>
    );
  };

  const renderShadow = () => {
    const animatedShadowOpacity = Animated.interpolateNode(fall, {
      inputRange: [0, 1],
      outputRange: [0.4, 0],
    });

    return <AnimatedView pointerEvents={'none'} style={[styles.shadowContainer, { opacity: Platform.OS === 'ios' ? animatedShadowOpacity : 0.4 }]} />;
  };

  const snapPoints = [Layout.isMediumDevice || Layout.isSmallDevice ? 368 : 390, 0];

  return (
    <>
      {isLoading && <Preloader />}
      <View style={styles.shadow} onLayout={onLayout}>
        {renderShadow()}
        {!!popupHeight && (
          <>
            <BottomSheet
              onCloseEnd={() => !isProcessing && onFinishHandler()}
              ref={sheetHelpUsRef}
              snapPoints={snapPoints}
              initialSnap={1}
              renderContent={renderSheetHelpUsContent}
              callbackNode={fall}
              enabledGestureInteraction={false}
            />
            <BottomSheet
              ref={sheetQuestionRef}
              snapPoints={[popupHeight, 0]}
              initialSnap={1}
              callbackNode={fall}
              enabledInnerScrolling={true}
              renderContent={renderSheetQuestionContent}
              enabledGestureInteraction={false}
            />
            <BottomSheet
              ref={sheetSuccessRef}
              snapPoints={[popupHeight, 0]}
              initialSnap={1}
              callbackNode={fall}
              renderContent={renderSheetSuccessContent}
              enabledGestureInteraction={false}
            />
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    alignItems: 'center',
    overflow: 'visible',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: 'transparent',
    paddingHorizontal: 18,
    elevation: 45,
  },
  bottomSheetSuccess: {
    alignItems: 'center',
    paddingHorizontal: 16,
    height: Layout.window.height,
  },
  shadow: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    elevation: 101,
    zIndex: 101,
  },
  divider: {
    width: 32,
    height: 4,
    backgroundColor: Colors.darkGray,
    opacity: 0.6,
    borderRadius: 64,
    alignSelf: 'center',
    marginTop: 18,
  },
  textWrap: {
    textAlign: 'center',
  },
  sheetTitle: {
    marginTop: 16,
    alignSelf: 'center',
    textAlign: 'center',
  },
  desc: {
    marginTop: 12,
    textAlign: 'center',
  },
  buttonHelp: {
    marginTop: 16,
  },
  textButton: {
    textAlign: 'center',
    color: Colors.primaryBlue,
    fontWeight: '500',
  },
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
  },
  imageHelp: {
    width: 75,
    height: 80,
    marginTop: 23,
  },
  imageClose: {
    marginTop: Layout.isMediumDevice || Layout.isSmallDevice ? 22 : 44,
    alignSelf: 'flex-start',
  },
  imageSuccess: {
    width: 220,
    height: 220,
    marginTop: 62,
  },
  successMsg: {
    marginTop: 10,
    width: 'auto',
    marginHorizontal: 44,
    textAlign: 'center',
  },
  spacing: {
    flex: 1,
  },
  spacing52: {
    height: 52,
    ...Platform.select({
      android: {
        height: Layout.isMediumDevice ? 52 : 78,
      },
    }),
  },
  buttonGotIt: {
    marginBottom: Layout.isMediumDevice || Layout.isSmallDevice ? 120 : 150,
  },
});

export default HelpPopUp;
