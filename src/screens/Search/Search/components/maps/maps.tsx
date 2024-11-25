import React, { useRef, RefObject, useCallback, forwardRef, useMemo } from 'react';
import MapView from 'react-native-map-clustering';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '../canvas';
import { GestureHandler } from '../gesture';
import type { IMapProps } from './types';
import {
  DEFAULT_ACTIVE_COLOR_LINE_WIDTH,
  DEFAULT_FILL_BACKGROUND_CANVAS,
  DEFAULT_BACKGROUND_VIEW_CANVAS,
  DEFAULT_INDEX_INITIAL_LAT_LNG,
  DEFAULT_CREATED_NEW_POLYGON,
  DEFAULT_ACTIVE_COLOR_LINE,
  DEFAULT_UNIT_DISTANCE,
  DEFAULT_DRAW_MODE,
} from './contstant';
import * as GEO from 'geolib';
import type { ILocationProps } from './types';

export default forwardRef<MapView, IMapProps>((props, ref) => {
  const {
    points,
    children,
    colorLine = DEFAULT_ACTIVE_COLOR_LINE,
    widthLine = DEFAULT_ACTIVE_COLOR_LINE_WIDTH,
    onEndDraw,
    isDrawMode = DEFAULT_DRAW_MODE,
    renderPath,
    onStartDraw,
    unitDistance = DEFAULT_UNIT_DISTANCE,
    onChangePoints,
    createdPolygon = DEFAULT_CREATED_NEW_POLYGON,
    fillColorCanvas = DEFAULT_FILL_BACKGROUND_CANVAS,
    styleViewGesture,
    backgroundCanvas = DEFAULT_BACKGROUND_VIEW_CANVAS,
    clusteringEnabled,
    renderCluster,
    onClusterPress,
    ...rest
  } = props;
  const internalRef = useRef<MapView>(null);
  const mapRef = (ref as RefObject<MapView>) || internalRef;

  const containerStyle = useMemo(
    () => [
      { zIndex: 1, backgroundColor: backgroundCanvas },
      StyleSheet.absoluteFill,
      styleViewGesture,
    ],
    [backgroundCanvas, styleViewGesture],
  );

  const path = useMemo(
    () => points.map((item) => `${item.x},${item.y}`).join(' '),
    [points, isDrawMode],
  );

  const calculatedCenterPolygon = (coordinates: ILocationProps[]) => {
    return Promise.resolve(GEO.getCenter(coordinates));
  };

  const convertPointToCoordinates = useCallback(
    (polygons) => {
      if (polygons && polygons.length > 0) {
        calculatedCenterPolygon(polygons).then((centerLatLng) => {
          if (onEndDraw && centerLatLng) {
            const distance = GEO.convertDistance(
              GEO.getPathLength(polygons),
              unitDistance,
            );
            const initialLatLng = polygons[DEFAULT_INDEX_INITIAL_LAT_LNG];
            const lastLatLng = initialLatLng;
            // Need to be sure that the last coordinates are equal to the first coordinates
            polygons[polygons.length - 1] = initialLatLng;
            onEndDraw({
              polygons,
              distance,
              centerLatLng,
              initialLatLng,
              lastLatLng,
            });
          }
        });
      }
    },
    [onEndDraw, unitDistance],
  );

  const convertByPoint = useCallback(async (item) => {
    // @ts-ignore
    return await mapRef.current?.coordinateForPoint(item);
  },
    [mapRef]
  );

  const handleEndDraw = useCallback(
    async (data) => {
      await Promise.all(data.map(convertByPoint)).then(convertPointToCoordinates);
    },
    [convertByPoint, convertPointToCoordinates],
  );

  const hasCanvas = useMemo(() => {
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        <>
          {renderPath ? (
            renderPath(path)
          ) : (
            <Canvas
              path={path}
              widthLine={widthLine}
              colorLine={colorLine}
              fillColorCanvas={fillColorCanvas}
            />
          )}
          <GestureHandler
            onEndTouchEvents={handleEndDraw}
            onStartTouchEvents={onStartDraw}
            onChangeTouchEvents={onChangePoints}
          />
        </>
      </View>
    );
  }, [
    path,
    widthLine,
    colorLine,
    renderPath,
    onStartDraw,
    handleEndDraw,
    containerStyle,
    onChangePoints,
    fillColorCanvas,
  ]);

  const hasMap = (
    <MapView
      scrollEnabled={!isDrawMode}
      animationEnabled={false}
      ref={mapRef}
      {...rest}
      clusteringEnabled
      renderCluster={renderCluster}
      onClusterPress={onClusterPress}
      preserveClusterPressBehavior={true}
    >
      {children}
    </MapView>
  );

  return (
    <>
      {hasMap}
      {isDrawMode && !createdPolygon && hasCanvas}
    </>
  );
});
