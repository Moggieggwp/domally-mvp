import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Text } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import TextInput from './TextInput';

export type SquareInputProps = {
  containerStyles?: StyleProp<ViewStyle>;
  onInputChange?: (value: string) => void;
  onSelectInputChange?: () => void;
  inputLabel: string;
  hint: string;
  selectInputPlaceholder: string;
  title: string;
  disabled?: boolean;
  inputValue?: string;
  selectValue?: string;
  editableTitleValue?: string;
  onTitleEditChange?: (value: string) => void;
  onSquareFocus?: () => void;
};

export default function SquareInput(props: SquareInputProps) {
  const {
    onInputChange,
    onSelectInputChange,
    inputLabel,
    selectInputPlaceholder,
    hint,
    title,
    containerStyles,
    disabled,
    inputValue,
    selectValue,
    onTitleEditChange,
    editableTitleValue,
    onSquareFocus,
  } = props;

  const onChangeHandler = (value: string) => {
    if (onInputChange) {
      onInputChange(value);
    }
  }

  const onSelectChangeHandler = () => {
    if (onSelectInputChange) {
      onSelectInputChange();
    }
  }

  return (
    <View style={[styles.container, containerStyles]}>
      {!!onTitleEditChange ?
        <TextInput
          styleInput={styles.input}
          autoFocus={!!onTitleEditChange && !editableTitleValue?.length}
          editable={true}
          styleWrap={styles.input}
          value={editableTitleValue}
          onChange={onTitleEditChange}
          placeholder='Place name'
        />
        :
        <Text style={[TextStyles.textBtn, styles.title]}>{title}</Text>
      }
      <TextInput
        editable={!disabled}
        showSoftInputOnFocus={false}
        styleWrap={styles.inputSelect}
        label={selectInputPlaceholder}
        onFocus={onSelectChangeHandler}
        value={selectValue}
      />
      <TextInput
        editable={!disabled}
        keyboardType='numeric'
        styleWrap={styles.input}
        label={inputLabel}
        hint={hint}
        value={inputValue}
        onFocus={onSquareFocus}
        onChange={onChangeHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    width: 85,
    textTransform: 'capitalize',
  },
  inputSelect: {
    maxWidth: 156,
  },
  input: {
    maxWidth: 88,
  }
});
