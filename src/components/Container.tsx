import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: 32,
    paddingRight: 32,
    paddingVertical: 0,
  },
});

type ContainerProps = {
  children: any;
  style?: StyleProp<ViewStyle>;
};

export default class Container extends React.Component<ContainerProps> {
  render() {
    const { children, style } = this.props;

    return <View style={[styles.container, style]}>{children}</View>;
  }
}
