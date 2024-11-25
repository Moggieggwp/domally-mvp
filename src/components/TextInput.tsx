import React, { useEffect, useState } from 'react';
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
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import Typography from 'src/styles/Typography';
import clearIcon from '../assets/img/icons/clear.png';

const LABEL_DEFAULT_FONT_SIZE = 14;
const LABEL_TOP_FONT_SIZE = 9;

interface ITextInputProps {
  forceError?: string;
  placeholder?: string;
  styleInput?: StyleProp<TextStyle>;
  styleWrap?: StyleProp<TextStyle>;
  styleError?: StyleProp<TextStyle>;
  secureTextEntry?: boolean;
  value?: string;
  placeholderTextColor?: string;
  editable?: boolean;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  returnKeyType?: TextInputProps['returnKeyType'];
  inputRef?: React.LegacyRef<TextInput>;
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
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  isValid?: boolean;
  hint?: string;
  withClear?: boolean;
  showSoftInputOnFocus?: boolean;
  inputAccessoryViewID?: string;
  useTransformForLabel?: boolean;
}

export default function Input(props: ITextInputProps) {
  const [labelPosition] = useState(new Animated.Value(0));
  const [labelFontSize] = useState(new Animated.Value(LABEL_DEFAULT_FONT_SIZE));
  const [inputValue, setValue] = useState('');
  const [focused, setFocus] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);

  const onChange = (v: string) => {
    setValue(v);

    props.onChange?.(v);
    props.onChangeText?.(v)
  };

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
      if (!focused) {
        playFocusAnimation(0);
      }
    }
  }, [props.value])

  const onFocus = () => {
    setFocus(true);

    if (props.onFocus) {
      props.onFocus();
    }

    playFocusAnimation(375);
  };

  const playFocusAnimation = (duration: number) => {
    Animated.parallel([
      Animated.timing(labelFontSize, {
        toValue: LABEL_TOP_FONT_SIZE,
        duration: duration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(labelPosition, {
        toValue: -17,
        duration: duration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      // cb
    });
  }

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocus(false);

    if (inputValue.length === 0) {
      Animated.parallel([
        Animated.timing(labelFontSize, {
          toValue: LABEL_DEFAULT_FONT_SIZE,
          duration: 375,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(labelPosition, {
          toValue: 0,
          duration: 375,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(() => {
        // cb
      });
    }

    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const onSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  const {
    styleInput,
    styleWrap,
    styleError,
    placeholder,
    secureTextEntry,
    placeholderTextColor,
    forceError,
    editable,
    onTouchStart,
    value,
    label,
    multiline,
    numberOfLines,
    returnKeyType,
    inputRef,
    autoFocus,
    autoCompleteType,
    keyboardType,
    autoCorrect,
    autoCapitalize,
    textContentType,
    skipBlurOnSubmit,
    maxLength,
    hint,
    withClear,
    showSoftInputOnFocus = true,
    inputAccessoryViewID,
    useTransformForLabel = true,
  } = props;

  const errorText = forceError;

  const borderColor = () => {
    if (focused && !errorText) {
      return Colors.input.validColor;
    }

    if (!!errorText) {
      return Colors.input.invalidColor;
    }

    return Colors.input.border;
  };

  const labelColor = () => {
    if (focused) {
      return Colors.input.validColor;
    }
    if (!!errorText) {
      return Colors.input.invalidColor;
    }
    return Colors.darkGray;
  };

  return (
    <View style={[styles.wrap, { borderBottomColor: borderColor() }, styleWrap, { height: inputHeight }]}>
      {label && (
        <Animated.Text
          style={[
            TextStyles.body2,
            styles.label,
            {
              transform: [{ translateY: useTransformForLabel ? labelPosition : 0 }],
              top: !useTransformForLabel ? labelPosition : null,
              fontSize: labelFontSize,
              color: labelColor(),
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}
      <TextInput
        autoCorrect={autoCorrect}
        ref={inputRef}
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
        secureTextEntry={secureTextEntry}
        editable={editable}
        onTouchStart={onTouchStart}
        textContentType={textContentType}
        inputAccessoryViewID={inputAccessoryViewID}
        showSoftInputOnFocus={showSoftInputOnFocus}
        onContentSizeChange={(e) => multiline && setInputHeight(e.nativeEvent.contentSize.height + 19)}
      />

      {!!errorText && <Text style={[styles.errorText, styleError]}>{errorText}</Text>}
      {hint && <Text style={[TextStyles.body2, styles.hint]}>{hint}</Text>}
      {withClear && <TouchableOpacity style={styles.hint} onPress={() => onChange('')}>
        <Image source={clearIcon} />
      </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    width: '100%',
    height: 40,
    minHeight: 40,
    justifyContent: 'center',
    textAlign: 'left',
    borderBottomWidth: 1,
    paddingRight: 12,
  },
  label: {
    position: 'absolute',
    color: Colors.darkGray,
    fontWeight: '400',
    left: 0,
  },
  input: {
    lineHeight: Platform.OS === 'ios' ? 0 : 16,
  },
  errorText: {
    ...Typography.smallBody,
    position: 'absolute',
    bottom: -20,
    width: '100%',
    color: Colors.red,
  },
  hint: {
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
    color: Colors.darkGray,
    padding: 5,
  },
});
