import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { TextStyles } from 'src/styles/BaseStyles';
import BackButton from '../BackButton';
import Button from '../Button';
import ProgressBar from '../ProgressBar';

type Props = {
  onBack?: () => void;
  onFinish?: () => void;
  stepsLength: number;
  currentStepIndex: number;
}

const StepHeader = (props: Props) => {
  const { stepsLength, currentStepIndex, onFinish, onBack } = props;

  if (!stepsLength || !currentStepIndex) {
    return null;
  }

  const progress = currentStepIndex / stepsLength;

  return (
    <View style={styles.container}>
      <BackButton disabled={!onBack} onPress={onBack} style={styles.backButton} />
      <ProgressBar
        progressStyles={[styles.progressWrap, { marginRight: onFinish ? -54 : 0 }]}
        progress={progress}
        progressColor={Colors.secondaryGreen}
        progressUnfilledColor='rgba(104, 202, 135, 0.1)'
      />
      {onFinish ?
        <Text onPress={onFinish} style={[TextStyles.btnTitle, styles.finishTitle]}>Finish later</Text>
        :
        <Text
          style={[TextStyles.body2]}
        >{`${currentStepIndex}/${stepsLength}`}</Text>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? (Layout.isMediumDevice ? Layout.getViewHeight(3.7) : Layout.getViewHeight(6.7)) : 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: 14,
    paddingRight: 16,
    backgroundColor: Colors.white,
  },
  backButton: {
    alignSelf: 'flex-start',
    position: 'relative',
  },
  progressWrap: {
    width: 150,
  },
  finishTitle: {
    color: Colors.button.ghostBtnColor,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    padding: 5,
  }
});

export default StepHeader;
