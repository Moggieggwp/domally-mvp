import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TextInputProps,
  StyleProp,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

import SearchIcon from 'src/assets/img/icons/search-icon.svg';
import CrossIcon from 'src/assets/img/icons/cross-icon.svg';
import FilterIcon from 'src/assets/img/icons/filter-icon.svg';

interface ISearchInputProps {
  placeholder?: string;
  styleInput?: StyleProp<TextStyle>;
  styleWrap?: StyleProp<TextStyle>;
  value?: string;
  placeholderTextColor?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  returnKeyType?: TextInputProps['returnKeyType'];
  autoFocus?: boolean;
  autoCompleteType?: TextInputProps['autoCompleteType'];
  keyboardType?: TextInputProps['keyboardType'];
  autoCorrect?: TextInputProps['autoCorrect'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  textContentType?: TextInputProps['textContentType'];
  skipBlurOnSubmit?: boolean;
  maxLength?: number;
  onSubmit?: () => void;
  onTouchStart?: () => void;
  onBlur?: TextInputProps['onBlur'];
  onChange: (value: string) => void;
  onFocus?: () => void;
  onFilterPress?: () => void;
  onChangeText?: (value: string) => void;
  withClear?: boolean;
  disabled?: boolean;
}

export default function SearchInput(props: ISearchInputProps) {
  const [inputValue, setValue] = useState('');
  const [focused, setFocus] = useState(false);
  const inputEl: React.LegacyRef<TextInput> = useRef(null);

  const onChange = (v: string) => {
    setValue(v);

    props.onChange?.(v);
    props.onChangeText?.(v)
  };

  const onFocus = () => {
    if (props.disabled) {
      return;
    }

    setFocus(true);

    if (props.onFocus) {
      props.onFocus();
    }
  };

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocus(false);

    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const onSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  const onCrossPress = () => {
    inputEl.current.clear();
    setValue('');
  };

  const onFilterPressHandler = () => {
    if (props.onFilterPress) {
      props.onFilterPress();
    }
  };

  const {
    styleInput,
    styleWrap,
    placeholder,
    placeholderTextColor,
    editable,
    onTouchStart,
    value,
    multiline,
    numberOfLines,
    returnKeyType,
    autoFocus,
    autoCompleteType,
    keyboardType,
    autoCorrect,
    autoCapitalize,
    textContentType,
    skipBlurOnSubmit,
    maxLength,
    onFilterPress,
    withClear,
    disabled,
  } = props;

  return (
    <View style={[styles.wrap, styleWrap]}>
      <SearchIcon style={styles.searchIcon} />
      <TextInput
        autoCorrect={autoCorrect}
        ref={inputEl}
        onSubmitEditing={onSubmit}
        returnKeyType={returnKeyType || 'done'}
        onChangeText={onChange}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        blurOnSubmit={!skipBlurOnSubmit}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        autoFocus={autoFocus}
        autoCompleteType={autoCompleteType}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        placeholderTextColor={placeholderTextColor || Colors.darkGray}
        maxLength={maxLength}
        style={[TextStyles.body2, { color: Colors.input.text }, styles.input, styleInput]}
        editable={!disabled && editable}
        onTouchStart={onTouchStart}
        textContentType={textContentType}
      />
      {withClear && inputValue.length != 0 ? (
        <TouchableOpacity onPress={onCrossPress} activeOpacity={0.8} style={[styles.crossWrap]}>
          <CrossIcon style={styles.crossIcon} />
        </TouchableOpacity>
      ) : onFilterPress ? (
        <TouchableOpacity onPress={onFilterPressHandler} activeOpacity={0.8} style={[styles.crossWrap]}>
          <FilterIcon style={styles.filterIcon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    width: '100%',
    height: 46,
    justifyContent: 'center',
    textAlign: 'left',
    borderWidth: 0.5,
    borderColor: Colors.searchInput.border,
    backgroundColor: Colors.searchInput.bg,
    borderRadius: 10,
  },
  input: {
    lineHeight: Platform.OS === 'ios' ? 0 : 16,
    paddingLeft: 39,
  },
  searchIcon: {
    position: 'absolute',
    left: 17,
    width: 12,
    height: 12,
  },
  crossIcon: {
    width: 14,
    height: 14,
  },
  crossWrap: {
    width: 30,
    height: 30,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 8,
  },
  filterIcon: {},
});
