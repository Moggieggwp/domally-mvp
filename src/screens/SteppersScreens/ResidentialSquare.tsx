import React, { ReactNode, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, Modal, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Container, Page, TextInput, SwipeableInput, WheelPicker } from 'src/components';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import { TextStyles } from 'src/styles/BaseStyles';
import { squareScreenStyle as styles } from 'src/styles/stepperScreens/squareScreens';

import AddIcon from 'src/assets/img/icons/add-icon.svg';
import Animated from 'react-native-reanimated';
import { currentPropertyId, currentPropertyResidentialDetails, currentPropertySize, currentPropertySquare } from 'src/redux/selectors/currentProperty';
import { saveProperty } from 'src/redux/actions/currentProperty';
import { AreaLocation, MeasureSquare, UIArea } from 'src/types';
import { convertSquareDetailsToUI, convertUISquareDetails, createRow, validateRows, generateSquareRows } from 'src/utils/squareScreens';
import { WHEEL_OPTIONS } from 'src/constants/createProperty/SquareScreens';
import { metricsSelector } from 'src/redux/selectors/app';
import { getSquareActiveIndex } from 'src/utils/metricsHelper';
import { setAppMetrics } from 'src/redux/actions/app';
import Typography from 'src/styles/Typography';

type Props = {
  onNext?: () => void;
  navigation?: StackNavigationProp<RootStackParamsList>;
};

const ResidentialSquare = (props: Props) => {
  const { onNext, navigation } = props;

  const [rows, setRows] = useState<UIArea[]>([]);
  const [currentRow, setCurrentRow] = useState<UIArea>(null);
  const [generalSquare, setGeneralSquare] = useState('');

  const [isSwiping, setSwiping] = useState(false);
  const sheetRef = React.useRef<BottomSheet>(null);
  const statePropertyDetails = useSelector(currentPropertyResidentialDetails);
  const statePropertySquare = useSelector(currentPropertySquare);
  const stateSize = useSelector(currentPropertySize);
  const propertyId = useSelector(currentPropertyId);
  const stateMetrics = useSelector(metricsSelector);

  const [activeBtnIndex, setActiveBtnIndex] = useState(getSquareActiveIndex(stateSize?.measure as MeasureSquare) || getSquareActiveIndex(stateMetrics?.square) || 0);

  const dispatch = useDispatch();

  const activeMetricMeasure = SQUARE_BUTTONS[activeBtnIndex].measure;
  const fall = new Animated.Value(1);

  useEffect(() => {
    if (statePropertySquare) {
      setRows(convertSquareDetailsToUI(statePropertySquare));
    } else {
      if (!rows.length && statePropertyDetails?.residentialNumberOfBedrooms) {
        generateRows(statePropertyDetails?.residentialNumberOfBedrooms, 'bedroom');
      }
  
      if (!rows.length && statePropertyDetails?.residentialNumberOfBathrooms) {
        generateRows(statePropertyDetails?.residentialNumberOfBathrooms, 'bathroom');
      }
    }

    if (stateSize?.value && stateSize?.measure) {
      const activeIndex = getSquareActiveIndex(stateSize.measure as MeasureSquare);
      setActiveBtnIndex(activeIndex);
      setGeneralSquare(stateSize.value.toString());
    }
  }, [statePropertyDetails, stateSize]);

  useEffect(() => {
    if (!stateMetrics) return;

    if (!stateSize?.measure) {
      const activeIndex = getSquareActiveIndex(stateMetrics.square);
      setActiveBtnIndex(activeIndex);
    }
  }, [stateMetrics]);

  const onMetricChange = (index: number) => {
    dispatch(setAppMetrics({
      square: SQUARE_BUTTONS[index].measure,
    }));
  };

  const generateRows = (rowsNumber: number, title: string) => {
    const rowItems = generateSquareRows(rowsNumber, title);
    setRows(prev => [...prev, ...rowItems]);
  };

  const addNewRow = () => {
    const newRow: UIArea = createRow();
    setRows(prev => [...prev, newRow]);
  };

  const onSquareInputChange = (value: string, rowId: string) => {
    setRows(rows.map(r => {
      if (r.id !== rowId) return r;
      return { ...r, square: value, }
    }))
  };

  const onTitleInputChange = (value: string, rowId: string) => {
    setRows(rows.map(r => {
      if (r.id !== rowId) return r;
      return { ...r, editableTitleValue: value, }
    }))
  };

  const wheelSelectOnChange = (value: AreaLocation) => {
    if (!currentRow) return;
    const rowId = currentRow.id;

    setRows(rows.map(r => {
      if (r.id !== rowId) return r;
      return { ...r, areaLocation: value }
    }))
  };

  const deleteItem = (id: string) => {
    setRows(rows.filter(el => el.id !== id));
  };

  const onItemDelete = (id: string) => {
    Alert.alert('Do you want to delete?', '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteItem(id),
          style: 'destructive',
        },
      ]
    );
  };

  const validateData = () => {
    if (!generalSquare?.length) {
      return false;
    }

    return validateRows(rows);
  };

  const onSubmitHandler = async () => {
    const isValid = validateData();

    if (!isValid) {
      Alert.alert('You need to fill all fields');
      return;
    }

    await dispatch(saveProperty({
      id: propertyId,
      size: {
        value: parseInt(generalSquare, 10),
        measure: activeMetricMeasure,
      },
      squareDetails: convertUISquareDetails(rows),
    }));

    onNext();
  };

  const hideBottomSheetSelect = () => {
    sheetRef.current.snapTo(1);
  };

  const onWheelContinue = () => {
    hideBottomSheetSelect();
    setCurrentRow(null);
  };

  const showBottomSheetSelect = () => {
    sheetRef.current.snapTo(0);
  };

  const onSelectPress = (id: string) => {
    const activeRow = rows.find(r => r.id === id);
    setCurrentRow(activeRow);

    showBottomSheetSelect();
  };

  const renderSheetContent = (): ReactNode => {
    const selectedIndex = currentRow ? WHEEL_OPTIONS.findIndex(el => el === currentRow?.areaLocation) : 0;

    return (
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetContainer}>
          <Text style={[TextStyles.cardTitle1, styles.sheetTitle]}>{currentRow?.title || currentRow?.editableTitleValue}</Text>
          <WheelPicker
            onChange={wheelSelectOnChange}
            items={WHEEL_OPTIONS}
            selectedItemIndex={selectedIndex}
          />
          <View style={styles.sheetBtnWrap}>
            <Button style={styles.sheetBtn} title='Continue' onPress={onWheelContinue} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <Page keyboardAvoidingEnabled>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Square' />
        <View style={styles.btnWrap}>
          {SQUARE_BUTTONS.map((btn, i) => {
            const isActive = i === activeBtnIndex;
            return <TouchableOpacity  
              key={btn.measure}
              style={[styles.btn, isActive ? styles.activeBtn : {}]}
              onPress={() => onMetricChange(i)}>
                <Text style={[styles.btnTitle, isActive ? styles.activeBtnTitle : {}]}> {btn.symbol}</Text>
                <Text style={[Typography.btnTitle, styles.supStyle, isActive && styles.activeBtnTitle]}>2</Text>
            </TouchableOpacity>
          })}
        </View>
      </Container>
      <ScrollView scrollEnabled={!isSwiping} contentContainerStyle={styles.content}>
        <View style={[styles.generalInputWrap, styles.squareItem]}>
          <Text style={[TextStyles.textBtn, styles.title]}>General</Text>
          <TextInput styleWrap={styles.input}
            label='Square'
            hint={SQUARE_BUTTONS[activeBtnIndex].symbol}
            keyboardType='numeric'
            onChange={value => setGeneralSquare(value)}
            value={generalSquare}
            onFocus={hideBottomSheetSelect}
          />
        </View>
        {rows.map((item) =>
          <SwipeableInput
            key={item.id}
            style={styles.squareItem}
            onSwipeStart={() => setSwiping(true)}
            onSwipeRelease={() => setSwiping(false)}
            hint={SQUARE_BUTTONS[activeBtnIndex].symbol}
            inputLabel='Square'
            selectInputPlaceholder='Location of the area'
            title={item.title}
            onInputChange={value => onSquareInputChange(value, item.id)}
            onSelectInputChange={() => onSelectPress(item.id)}
            onDelete={() => onItemDelete(item.id)}
            selectedValue={item?.areaLocation}
            inputValue={item?.square}
            onTitleEditChange={item.editable ? value => onTitleInputChange(value, item.id) : null}
            editableTitleValue={item.editableTitleValue}
            onSquareFocus={hideBottomSheetSelect}
          />
        )}
        <Button
          onPress={() => addNewRow()}
          style={styles.addBtn}
          isGhost
        >
          <AddIcon width={18} height={18} />
          <Text style={[TextStyles.textBtn, styles.addBtnTitle]}>Add place</Text>
        </Button>
        <View style={{height: 150, width: '100%'}} />
      </ScrollView>
      <StepperFooter
        onSubmit={onSubmitHandler}
        apartmentsLength={308}
      />
      <BottomSheet
        ref={sheetRef}
        snapPoints={[390, 0]}
        initialSnap={1}
        borderRadius={0}
        renderContent={renderSheetContent}
        callbackNode={fall}
        enabledInnerScrolling={true}
      />
    </Page>
  );
};

export default ResidentialSquare;
