import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useReducer, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import AddIcon from 'src/assets/img/icons/add-icon.svg';
import propertyPhoto from 'src/assets/img/icons/propertyPhoto.png';
import successIcon from 'src/assets/img/icons/successIcon.png';
import { BottomSheet, Button, Container, Page } from 'src/components';
import StepperFooter from 'src/components/stepper/StepperFooter';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { saveProperty, uploadCurrentPropertyPhotos } from 'src/redux/actions/currentProperty';
import { currentPropertyDefaultPhoto, currentPropertyId, currentPropertyPhotos } from 'src/redux/selectors/currentProperty';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';

const maxPhotosLength = 12;

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const PropertyPhotos = (props: Props) => {
  const { onNext } = props;

  const propertyId = useSelector(currentPropertyId);
  const photos = useSelector(currentPropertyPhotos) || [];
  const defaultPhoto = useSelector(currentPropertyDefaultPhoto);

  const [showSelectedPhotoSheet, setShowSelectedPhotoSheet] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number>();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const [retry, forceUpdate] = useReducer((x) => x + 1, 0);

  const selectedPhotoSheetRef = useRef<BottomSheetContainer>(null);
  const dispatch = useDispatch();

  const onSubmitHandler = async () => {
    onNext();
  };

  const onSelectPhotoPress = useCallback(() => {
    setShowSelectedPhotoSheet(true);
    selectedPhotoSheetRef.current.snapTo(0);
  }, [showSelectedPhotoSheet]);

  const hideSelectPhotoSheet = () => {
    setShowSelectedPhotoSheet(false);
    selectedPhotoSheetRef.current.snapTo(1);
  };

  const onRemovePhotoPressed = () => {
    if (photos?.length <= 1) {
      showDeleteLastPhotoAlert();
      return;
    };

    const updatedPhotos = photos.filter((item, index) => index !== selectedPhoto);
    const isDefaultPhoto = photos.find((item, index) => index === selectedPhoto) === defaultPhoto;
    let data = { id: propertyId, photos: updatedPhotos, defaultPhoto: isDefaultPhoto ? null : defaultPhoto };
    const updatedUploadedPhotos = photos.filter((item, index) => index !== selectedPhoto);
    setUploadedPhotos(updatedUploadedPhotos);
    dispatch(saveProperty(data));
    hideSelectPhotoSheet();
  };

  const onMarkAsDefaultPhotoPressed = () => {
    const defaultPhoto = photos.find((item, index) => index === selectedPhoto);
    const data = { id: propertyId, defaultPhoto };
    dispatch(saveProperty(data));
    hideSelectPhotoSheet();
  };

  const handleUploadPhotoPress = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: maxPhotosLength - photos.length, maxHeight: 512, maxWidth: 512 }, (response) => {
      if (!response.errorCode && !response.didCancel) {
        dispatch(
          uploadCurrentPropertyPhotos(
            { id: propertyId, photos },
            response.assets.map((x) => x.uri),
          ),
        );
      }
    });
  };

  const showDeleteLastPhotoAlert = () => {
    Alert.alert('Photos shouldn\'t be empty');
  };

  const onImageLoadError = () => {
    forceUpdate();
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.container}>
        <View style={styles.content}>
          {!photos?.length && photos.length === 0 ? (
            <View style={styles.header}>
              <Image source={propertyPhoto} />
              <Text style={styles.title}>Property photos</Text>
              <Text style={styles.description}>Add photos to attract interest to your property. Include pictures with different angles, from interior and exterior, if applicable.</Text>
              <Text style={styles.descriptionLabel}>{`max of ${maxPhotosLength} photos`}</Text>
            </View>
          ) : (
            <>
              <View key={`${photos.length}_${retry}`} style={styles.photosWrap}>
                {photos.map((item, index) => (
                  <TouchableOpacity
                    key={item.toString()}
                    style={styles.itemStyle}
                    onPress={() => {
                      setSelectedPhoto(index);
                      onSelectPhotoPress();
                    }}
                  >
                    <FastImage source={{ uri: item.toString(), cache: 'web' }} style={styles.imageStyle} onError={() => onImageLoadError()} onLoad={() =>setUploadedPhotos([...uploadedPhotos, item]) }/>
                    {item === defaultPhoto && <Image source={successIcon} style={styles.defaultPhotoIcon} />}
                  </TouchableOpacity>
                ))}
              </View>
              {photos.length !== maxPhotosLength ? (
                <Button onPress={handleUploadPhotoPress} style={styles.addBtn} isGhost>
                  <AddIcon width={18} height={18} />
                  <Text style={[TextStyles.textBtn, styles.addBtnTitle]}>Add photos</Text>
                </Button>
              ) : (
                <></>
              )}
            </>
          )}

          {photos?.length === 0 && (
            <Button onPress={handleUploadPhotoPress} style={styles.addBtn} isGhost>
              <AddIcon width={18} height={18} />
              <Text style={[TextStyles.textBtn, styles.addBtnTitle]}>Add photos</Text>
            </Button>
          )}
        </View>
      </Container>
      <BottomSheet
        sheetRef={selectedPhotoSheetRef}
        onClose={() => setShowSelectedPhotoSheet(false)}
        onOutsidePress={hideSelectPhotoSheet}
        isActive={showSelectedPhotoSheet}
        showBg
      >
        <View style={styles.selectPhotoButtonsContainer}>
          <TouchableOpacity style={styles.selectPhotoButtons} onPress={onMarkAsDefaultPhotoPressed}>
            <Text style={styles.markAsDefaultSheetText}>Mark as default</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectPhotoButtons, { marginBottom: 24, marginTop: 16 }]} onPress={onRemovePhotoPressed}>
            <Text style={styles.cancelSheetText}>Remove photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cancelSheetButton}>
          <TouchableOpacity onPress={hideSelectPhotoSheet}>
            <Text style={styles.markAsDefaultSheetText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <StepperFooter onSubmit={onSubmitHandler} isNextBtnDisabled={photos?.length === 0 || !photos.every(x => uploadedPhotos.includes(x))} />
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Layout.getViewHeight(3.2),
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 12,
    ...TextStyles.h2,
  },
  description: {
    marginTop: 12,
    ...TextStyles.body1,
    textAlign: 'center',
  },
  descriptionLabel: {
    ...TextStyles.body1,
    textAlign: 'center',
    color: Colors.red,
  },
  content: {
    width: '100%',
  },
  addBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal: 15,
  },
  addBtnTitle: {
    color: Colors.primaryBlue,
    marginLeft: 9,
  },
  photosWrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemStyle: {
    justifyContent: 'flex-end',
    margin: 1,
  },
  imageStyle: {
    width: Layout.getViewWidth(27),
    height: Layout.getViewHeight(13),
  },
  defaultPhotoIcon: {
    position: 'absolute',
    right: 6,
  },
  selectPhotoButtonsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    alignItems: 'center',
    paddingTop: 14,
  },
  selectPhotoButtons: {
    alignItems: 'center',
  },
  cancelSheetText: {
    ...TextStyles.h5,
    color: Colors.red,
  },
  markAsDefaultSheetText: {
    ...TextStyles.h5,
    color: Colors.darkGray,
  },
  cancelSheetButton: {
    marginTop: 24,
    alignItems: 'center',
  },
});

export default PropertyPhotos;
