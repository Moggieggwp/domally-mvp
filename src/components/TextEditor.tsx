import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Container, Header, TextInput } from 'src/components';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

type TextEditorProps = {
  containerStyle: StyleProp<ViewStyle>;
  name: string;
  value: string;
  placeholder?: string;
  title: string;
  maxLength?: number;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  validationRules?: any;
  onChange: (value: string) => void;
  onSave?: (value: string) => void;
};

const TextEditor = (props: TextEditorProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onSubmit' });

  const [isEditorOpened, setIsEditorOpened] = useState(false);

  const onSavePressed = (data) => {
    props.onChange?.(data[props.name]);
    props.onSave?.(data[props.name]);

    setIsEditorOpened(false);
  };

  return (
    <>
      {props.disabled ? (
        <View style={props.containerStyle}>
          <Text style={[styles.textInputContainer, props.value && styles.blackText]}>{props.value || props.placeholder}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsEditorOpened(true)} style={props.containerStyle}>
          <Text style={[styles.textInputContainer, props.value && styles.blackText]}>{props.value || props.placeholder}</Text>
        </TouchableOpacity>
      )}
      {isEditorOpened && (
        <Modal visible={isEditorOpened}>
          <Header
            title={props.title}
            backText={'Cancel'}
            onBack={() => {
              setIsEditorOpened(false);
              reset();
            }}
            headerOptions={
              <TouchableOpacity style={styles.headerOptionsStyle} onPress={handleSubmit(onSavePressed)}>
                <Text style={[TextStyles.body2, { color: Colors.primaryBlue }]}>{'Save'}</Text>
              </TouchableOpacity>
            }
          />
          <Container style={styles.container}>
            <View>
              <Controller
                control={control}
                defaultValue={props.value}
                name={props.name}
                render={({ field: { onChange, value, onBlur } }) => {
                  return (
                    <>
                      <TextInput
                        {...props}
                        value={value}
                        onChange={(v) => onChange(v)}
                        withClear
                        onBlur={onBlur}
                        autoFocus={true}
                        forceError={errors && errors[props.name] && errors[props.name].message}
                      />
                      {props.maxLength && !errors[props.name] && <Text style={styles.maxLengthLabel}>{`${value?.length || 0}/${props.maxLength}`}</Text>}
                    </>
                  );
                }}
                rules={props.validationRules}
              />
            </View>
          </Container>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    ...TextStyles.body2,
    marginBottom: 8,
    color: Colors.darkGray,
  },
  container: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  maxLengthLabel: {
    ...TextStyles.smallBody,
    color: Colors.darkGray,
    marginTop: 11,
  },
  blackText: {
    color: Colors.primaryBlack,
  },
  headerOptionsStyle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  }
});

export default TextEditor;
