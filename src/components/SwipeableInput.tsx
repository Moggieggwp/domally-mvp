import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import SquareInput, { SquareInputProps } from 'src/components/SquareInput';
import Colors from 'src/constants/colors';
import Swipeable from 'react-native-swipeable';
import { TextStyles } from 'src/styles/BaseStyles';
import TrashIcon from 'src/assets/img/icons/trash-icon.svg';

type Props = SquareInputProps & {
    onDelete: () => void;
    onSwipeStart?: () => void;
    onSwipeRelease?: () => void;
    style?: StyleProp<ViewStyle>;
    inputValue?: string;
    selectedValue?: string;
    onTitleEditChange?: (value: string) => void;
    onInputChange?: (value: string) => void;
    onSelectInputChange?: () => void;
    editableTitleValue?: string;
    onSquareFocus?: () => void;
};

const SwipeableInput = (props: Props) => {
  const {
      hint,
      inputLabel,
      selectInputPlaceholder,
      title,
      onInputChange,
      onSelectInputChange,
      onDelete,
      onSwipeStart,
      onSwipeRelease,
      style,
      inputValue,
      selectedValue,
      onTitleEditChange,
      editableTitleValue,
      onSquareFocus,
    } = props;

  const [isSwiping, setSwiping] = useState(false);

  const onSwipeStartHandler = () => {
    if (onSwipeStart) {
      onSwipeStart();
    }
  };

  const onSwipeReleaseHandler = () => {
    if (onSwipeRelease) {
      onSwipeRelease();
    }
  };

  const rightButtons = [
    <TouchableOpacity onPress={onDelete} activeOpacity={0.8} style={styles.trashBtn}>
      <>
        <TrashIcon style={styles.trashBtnIcon} />
        <Text style={[TextStyles.body2, styles.trashBtnTitle]}>DELETE</Text>
      </>
    </TouchableOpacity>,
  ];

  const bgColor = isSwiping ? Colors.defaultBg : Colors.white;

  return (
        <Swipeable
          rightButtons={rightButtons}
          rightButtonWidth={64}
          onSwipeStart={onSwipeStartHandler}
          onSwipeRelease={onSwipeReleaseHandler}
          swipeReleaseAnimationConfig={{
            useNativeDriver: false,
            toValue: {
              x: 0,
              y: 0,
            },
          }}
          onSwipeMove={() => {
            setSwiping(true);
          }}
          onSwipeComplete={() => {
            setSwiping(false);
          }}
        >
          <SquareInput
            containerStyles={[styles.squareItem, style, { backgroundColor: bgColor }]}
            hint={hint}
            inputLabel={inputLabel}
            selectInputPlaceholder={selectInputPlaceholder}
            title={title}
            onInputChange={onInputChange}
            onSquareFocus={onSquareFocus}
            onSelectInputChange={onSelectInputChange}
            disabled={isSwiping}
            inputValue={inputValue}
            selectValue={selectedValue}
            onTitleEditChange={onTitleEditChange}
            editableTitleValue={editableTitleValue}
          />
        </Swipeable>
  );
};

export const styles = StyleSheet.create({
  squareItem: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  trashBtnIcon: {
    width: 18,
    height: 18,
    marginBottom: 7,
  },
  trashBtnTitle: {
    color: Colors.white,
    textTransform: 'capitalize',
  },
  trashBtn: {
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 68,
  },
  bottomSheet: {
    alignItems: 'center',
    overflow: 'visible',
    height: 198,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 32,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 5,
    shadowColor: 'rgba(14, 20, 56, 0.04)',
    shadowOpacity: 1,
    marginTop: 15,
  },
});


export default SwipeableInput;
