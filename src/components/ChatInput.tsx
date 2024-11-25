import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import CircleButton from './CircleButton';

import ChatIcon from 'src/assets/img/icons/send-message-icon.svg';

interface IChatInputProps {
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
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onSend: (value: string) => void;
}

export default function ChatInput(props: IChatInputProps) {
  const [inputValue, setValue] = useState('');
  const [focused, setFocus] = useState(false);
  const inputEl: React.LegacyRef<TextInput> = useRef(null);

  const onChange = (v: string) => {
    setValue(v);

    if (props.onChange) {
      props.onChange(v);
    }
  };

  const onFocus = () => {
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

  const onSendPress = () => {
    if (props.onSend) {
      props.onSend(inputValue);
    }

    inputEl.current.clear();
    setValue('');
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
  } = props;

  return (
    <View style={[styles.wrap, styleWrap]}>
      <TextInput
        autoCorrect={autoCorrect}
        ref={inputEl}
        onSubmitEditing={onSubmit}
        returnKeyType={returnKeyType || 'done'}
        onChangeText={onChange}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder || 'Type a message'}
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
        editable={editable}
        onTouchStart={onTouchStart}
        textContentType={textContentType}
      />
      <CircleButton styleWrap={styles.sendBtnWrap} styleBtn={styles.sendBtn} icon={ChatIcon} onPress={onSendPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    width: '100%',
    height: 44,
    justifyContent: 'center',
    textAlign: 'left',
    borderWidth: 0.5,
    borderColor: Colors.chatInput.border,
    borderRadius: 100,
  },
  input: {
    lineHeight: 0,
    paddingLeft: 22,
  },
  sendBtnWrap: {
    position: 'absolute',
    right: 3,
    alignSelf: 'center',
    width: 38,
    height: 38,
    borderRadius: 38,
  },
  sendBtn: {
    width: 38,
    height: 38,
    backgroundColor: Colors.chatInput.sendBtnBg,
  },
});
