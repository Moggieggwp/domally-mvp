import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import * as Progress from 'react-native-progress';

const DEFAULT_WIDTH = 124;

type ProgressBarProps = React.PropsWithChildren<{
  progress: number; // from 0 to 1
  progressStyles?: StyleProp<ViewStyle>;
  progressUnfilledColor?: string;
  progressColor?: string;
  progressWidth?: number;
}>;

export default function ProgressBar(props: ProgressBarProps) {
  const { progress, progressStyles, progressUnfilledColor, progressColor, progressWidth } = props;

  return (
    <View style={[styles.progressWrap, progressStyles || {}]}>
      <Progress.Bar
        progress={progress}
        width={progressWidth || DEFAULT_WIDTH}
        unfilledColor={progressUnfilledColor || '#4389eb33'}
        color={progressColor || '#4389EB'}
        borderColor='transparent'
        borderWidth={0}
        borderRadius={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrap: {
    width: '100%',
    alignItems: 'center',
  },
});
