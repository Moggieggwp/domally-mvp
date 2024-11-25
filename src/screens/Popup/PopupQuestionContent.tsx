import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import CloseIcon from 'src/assets/img/icons/close-icon.svg';
import { Button, RadioButton, TextEditor } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { sendUserFeedback } from 'src/redux/actions/app';
import TextStyles, { fontSemiBold } from 'src/styles/Typography';

type Props = {
  onSubmit: () => void;
  onClose: () => void;
};

const radioItems = [
  { id: 1, label: 'Facebook' },
  { id: 2, label: 'Friend referrals' },
  { id: 3, label: 'Organic search' },
];

const QuestionContent = (props: Props) => {
  const { onSubmit, onClose } = props;
  const [currentIndex, setItemIndex] = useState(0);
  const [textFeedback, setTextFeedback] = useState('');
  const dispatch = useDispatch();

  const toggleChecked = (index: number) => {
    setItemIndex(index);
  };

  const submitHandler = async () => {
    const selectedItem = radioItems.find((item) => item.id === currentIndex);

    await dispatch(
      sendUserFeedback({
        invitedFrom: selectedItem.label,
        feedback: textFeedback,
      }),
    );
    onSubmit();
  };

  return (
    <View style={[styles.bottomSheet]}>
      <View style={styles.divider} />
      <TouchableOpacity onPress={onClose}>
        <CloseIcon style={styles.closeButton} />
      </TouchableOpacity>
      <Text style={[TextStyles.h1, styles.title]}>PopUp</Text>
      <Text style={[TextStyles.body1, styles.subTitle]}>Please help us make our service better</Text>
      <Text style={[TextStyles.h5, styles.smallTitle]}>How did you learn about app?</Text>
      {radioItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.radioGroup}
          onPress={() => {
            toggleChecked(item.id);
          }}
        >
          <RadioButton key={item.id} index={item.id} checked={currentIndex === item.id} onChange={toggleChecked} />
          <Text style={[TextStyles.body1, currentIndex === item.id ? styles.radioTextActive : styles.radioTextInActive]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.line} />
      <ScrollView style={styles.popupCommentStyle}>
        <Text style={[TextStyles.h5, styles.smallTitle]}>Please give your feedback or tell about things we can add to improve the app</Text>
        <TextEditor
          title={'Description'}
          name={'description'}
          value={textFeedback}
          placeholder={'Your comment'}
          containerStyle={styles.textEditorContainer}
          multiline
          onChange={(value) => setTextFeedback(value)}
        />
      </ScrollView>

      <Button title={'Submit'} style={styles.buttonSubmit} onPress={submitHandler} disabled={textFeedback.length === 0 || currentIndex === 0} />

      <View style={styles.viewBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    overflow: 'visible',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 46,
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 100,
    height: '100%',
  },
  divider: {
    width: 32,
    height: 4,
    backgroundColor: Colors.darkGray,
    opacity: 0.6,
    borderRadius: 64,
    alignSelf: 'center',
    marginTop: 18,
  },
  title: {
    alignSelf: 'center',
  },
  subTitle: {
    marginHorizontal: 37,
    marginTop: 16,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  input: {
    marginTop: 38,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    width: '100%',
    paddingBottom: 8,
    lineHeight: 0,
  },
  smallTitle: {
    marginTop: 24,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 16,
  },
  radioTextActive: {
    color: Colors.primaryBlue,
    fontFamily: fontSemiBold,
    fontWeight: '600',
  },
  radioTextInActive: {
    color: Colors.primaryBlack,
    fontWeight: '400',
  },
  line: {
    backgroundColor: Colors.gray,
    height: 1,
    width: '100%',
    marginTop: 24,
  },
  inputFeedback: {
    marginTop: 16,
    borderBottomColor: Colors.input.border,
    borderBottomWidth: 1,
    width: '100%',
    lineHeight: 0,
  },
  closeButton: {
    marginTop: Layout.isMediumDevice || Layout.isSmallDevice ? 12 : 22,
  },
  buttonSubmit: {
    marginTop: 29,
  },
  viewBottom: {
    height: 20,
    width: 100,
  },
  textEditorContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.darkGray,
    marginTop: 24,
  },
  popupCommentStyle: {
    width: '100%',
    height: 'auto',
  },
});

export default QuestionContent;
