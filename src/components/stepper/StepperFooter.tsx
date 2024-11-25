import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextButton } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';

type Props = {
  onSubmit: () => void;
  onShowResults?: () => void;
  isNextBtnDisabled?: boolean;
  apartmentsLength?: number;
};

const StepperFooter = (props: Props) => {
  const { onSubmit, onShowResults, isNextBtnDisabled = false, apartmentsLength } = props;

  return (
    <View style={styles.btnWrap}>
      {onShowResults &&
        <TextButton
          hasUnderline
          containerStyle={styles.resultBtn}
          title={`Show properties (${apartmentsLength || '0'})`}
          onPress={onShowResults}
        />
      }
      <Button style={styles.submitBtn} disabled={isNextBtnDisabled} title='Next' onPress={onSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  btnWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.white,
    paddingTop: 26,
    paddingBottom: Layout.isMediumDevice ? 20 : 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  resultBtn: {
    marginBottom: 30,
  },
  submitBtn: {},
});

export default StepperFooter;
