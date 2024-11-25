import React, { useCallback, useEffect, useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { View, StyleSheet, StyleProp, ViewStyle, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Property } from 'src/types';
import MapPropertyCard from 'src/screens/Search/components/MapPropertyCard';
import * as Routes from 'src/constants/routes';
import * as NavigationService from 'src/services/NavigationService';
import Layout from 'src/constants/Layout';

const DEFAULT_CONTAINER_PADDING = 32;
const SLIDER_ITEM_HEIGHT = 176;

type PreloaderProps = {
  style?: StyleProp<ViewStyle>;
  properties: Property[];
  isSignIn: boolean;
  onChange?: (currentPropertyId: number) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const MapCarousel = (props: PreloaderProps) => {
  const { style, isSignIn, onChange, properties, onScroll } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!properties?.length) return;
    onChange(properties[0].id);
  }, []);

  const onItemChanged = (index) => {
    setCurrentIndex(index);
    onChange?.(properties[index]?.id);
  };

  const renderItem = useCallback(({item}) => {
    return (
      <View style={styles.slide}>
        <MapPropertyCard
          style={styles.propertyCard}
          property={item}
          isSignedIn={isSignIn}
          onCardPress={() => NavigationService.navigate(Routes.PropertyDetails, { propertyId: item.id })}
        />
      </View>
    );
  }, [properties]);

  if (!properties?.length) return null;

  return (
    <Carousel
      style={style}
      layout='default'
      initialNumToRender={currentIndex}
      data={properties}
      sliderWidth={Layout.window.width}
      sliderHeight={SLIDER_ITEM_HEIGHT}
      itemWidth={Layout.window.width - DEFAULT_CONTAINER_PADDING}
      itemHeight={SLIDER_ITEM_HEIGHT}
      layoutCardOffset={0}
      renderItem={renderItem}
      inactiveSlideOpacity={1}
      inactiveSlideScale={1}
      onSnapToItem={index => onItemChanged(index)}
      inactiveSlideShift={0}
      useScrollView
      vertical={false}
      loop={false}
      onScroll={onScroll}
      scrollEnabled
    />
  );
};

const styles = StyleSheet.create({
  container: {
  },
  slide: {
    width: '100%',
    paddingLeft: 0,
    paddingRight: 8,
  },
  propertyCard: {
    alignSelf: 'center',
  },
});

export default MapCarousel;
