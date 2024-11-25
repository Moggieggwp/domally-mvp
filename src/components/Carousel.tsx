import React, { useState } from 'react';
import { Text, ViewStyle, StyleProp, StyleSheet, View } from 'react-native';
import Carousell, { Pagination } from 'react-native-snap-carousel';
import BaseStyles, { TextStyles } from 'src/styles/BaseStyles';
import Colors from 'src/constants/colors';
import FastImage from 'react-native-fast-image';
import ZoomableImage from './ZoomableImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Label from './Label';

export interface ICarouselItem {
  imgUrl: string;
}

export type CarouselProps = {
  items: String[];
  defaultPhoto: String;
  sliderWidth: number;
  sliderHeight: number;
  itemWidth: number;
  itemHeight: number;
  vertical?: boolean;
  itemStyle: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  paginationStyle?: StyleProp<ViewStyle>;
  totalStyle?: StyleProp<ViewStyle>;
  loop?: boolean;
  onChange?: (index: number) => void;
  onPressCb?: () => void;
  hasPagination?: boolean;
  hasTotalCount?: boolean;
  propertyType?: string;
  propertyAction?: string;
  canZoom?: boolean;
  useScrollView?: boolean;
};

function Carousel(props: CarouselProps) {
  const {
    items,
    defaultPhoto,
    vertical,
    style,
    sliderWidth,
    sliderHeight,
    itemWidth,
    itemHeight,
    itemStyle,
    loop,
    onChange,
    hasTotalCount,
    hasPagination = true,
    propertyType,
    propertyAction,
    paginationStyle,
    totalStyle,
    useScrollView = true,
    canZoom,
    onPressCb,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  items.sort((first, second) => (first == defaultPhoto ? -1 : second == defaultPhoto ? 1 : 0));

  const onItemChanged = (index) => {
    setCurrentIndex(index);

    if (onChange) {
      onChange(index);
    }
  };

  const getPagination = () => {
    return (
      <Pagination
        dotsLength={items.length}
        activeDotIndex={currentIndex}
        containerStyle={[styles.pagination, paginationStyle]}
        dotStyle={styles.dotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  const renderItem = ({ item }): JSX.Element => {
    return canZoom ? (
      <ZoomableImage scrollCb={setScrollEnabled} source={item} style={[styles.card, itemStyle]} imageWidth={itemWidth} imageHeight={itemHeight} />
    ) : (
      <TouchableOpacity activeOpacity={1} onPress={onPressCb} style={[styles.card, itemStyle]}>
        <FastImage
          style={styles.image}
          source={{
            uri: item,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  const totalCountText = `${currentIndex + 1}/${items.length}`;

  return (
    <>
      {hasPagination && paginationStyle ? getPagination() : null}
      {hasTotalCount && items.length > 1 && totalStyle ? (
        <View style={[styles.totalWrap, totalStyle]}>
          <Text style={[TextStyles.smallBody, styles.counter]}>{totalCountText}</Text>
        </View>
      ) : null}
      <View style={[BaseStyles.flexCenter, styles.container, style]}>
        <Carousell
          layout='default'
          initialNumToRender={currentIndex}
          data={items}
          sliderWidth={sliderWidth}
          sliderHeight={sliderHeight}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          layoutCardOffset={0}
          renderItem={renderItem}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          onSnapToItem={(index) => onItemChanged(index)}
          inactiveSlideShift={0}
          useScrollView={useScrollView}
          vertical={vertical}
          loop={loop}
          scrollEnabled={scrollEnabled}
        />
        {hasPagination && !paginationStyle ? getPagination() : null}
        {hasTotalCount && items.length > 1 && !totalStyle ? (
          <View style={styles.totalWrap}>
            <Text style={[TextStyles.smallBody, styles.counter]}>{totalCountText}</Text>
          </View>
        ) : null}
        <View style={styles.labelContainer}>
          {propertyAction && <Label key='propertyAction' title={propertyAction} color='red' />}
          {propertyType && <Label key='propertyType' title={propertyType} color='blue' />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 17,
    overflow: 'hidden',
  },
  card: {
    height: 164,
  },
  pagination: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: -12,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginHorizontal: -10,
    backgroundColor: Colors.white,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    width: '100%',
  },
  totalWrap: {
    minWidth: 32,
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 5,
    bottom: 10,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: 41,
  },
  counter: {
    alignSelf: 'center',
  },
  propertyTypeWrap: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 7,
    bottom: 10,
    left: 12,
    borderRadius: 20,
    backgroundColor: Colors.primaryBlue,
  },
  propertyTypeText: {
    color: Colors.white,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    alignItems: 'flex-start',
  },
});

export default Carousel;
