import React, { useEffect } from 'react';
import { Polygon } from 'react-native-maps';
import { ILocationProps } from '../../components';
import Colors from 'src/constants/colors';

type Props = {
  coordinates: ILocationProps[];
};

const DEFAULT_COLOR = 'rgba(0,0,0,0.15)';

function MapPolygon(props: Props) {
  const ref = React.useRef(null);
  const { coordinates } = props;

  useEffect(() => {
    let timeout = setTimeout(() => {
      // We need to change fill color after timeout because of Maps Polygon fillColor bug
      if (ref.current) {
        setFillColor();
      }
    }, 10);

    return () => {
      clearTimeout(timeout);
    };
  }, [ref]);

  const setFillColor = async () => {
    await ref.current.setNativeProps({ fillColor: DEFAULT_COLOR, strokeColor: Colors.primaryBlack, strokeWidth: 2,});
  };

  return (
    <Polygon
      ref={ref}
      coordinates={coordinates}
      accessibilityIgnoresInvertColors={false}
      strokeColor={Colors.primaryBlack}
      strokeWidth={2}
      fillColor={DEFAULT_COLOR}
    />
  )
};

export default MapPolygon;