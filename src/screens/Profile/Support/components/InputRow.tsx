import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextEditor } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { TextStyles } from 'src/styles/BaseStyles';

type InputRowProps = {
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

const InputRow: React.FC<InputRowProps> = (props) => (
  <View style={styles.inputItem}>
    <Text style={[TextStyles.body2, styles.inputItemLabel]}>{props.title || props.placeholder}</Text>
    <TextEditor {...props} containerStyle={styles.textEditorContainer} />
  </View>
);

const styles = StyleSheet.create({
  inputItemLabel: {
    color: Colors.black,
    width: Layout.getViewWidth(25),
    marginBottom: 8,
  },
  inputItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  textEditorContainer: {
    width: Layout.getViewWidth(62),
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
});

export default InputRow;
