import { Dispatch } from 'redux';
import { apiRequest } from 'src/services/api';
import {
  RESET_CURRENT_PROPERTY,
  SAVE_PROPERTY,
  SAVE_PROPERTY_SUCCESS,
  SAVE_PROPERTY_ERROR,
  UPDATE_CURRENT_PROPERTY,
  DELETE_PROPERTY,
  DELETE_PROPERTY_ERROR,
  DELETE_PROPERTY_SUCCESS,
  UPLOAD_PROPERTY_PHOTOS,
  UPLOAD_PROPERTY_PHOTOS_ERROR,
  UPLOAD_PROPERTY_PHOTOS_SUCCESS,
} from './../actionTypes';
import { IAction, Property } from 'src/types';

export const saveProperty =
  (data: Property) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: SAVE_PROPERTY });

      const res = await apiRequest({
        method: 'post',
        url: '/properties',
        data,
      });

      dispatch({
        type: SAVE_PROPERTY_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: SAVE_PROPERTY_ERROR,
        payload: error,
      });
    }
  };

export const deleteProperty =
  (id: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: DELETE_PROPERTY });

      await apiRequest({
        method: 'delete',
        url: `/properties/${id}`,
      });

      dispatch({ type: DELETE_PROPERTY_SUCCESS });
    } catch (error) {
      dispatch({
        type: DELETE_PROPERTY_ERROR,
        payload: error,
      });
    }
  };

export const updateCurrentProperty = (data: Property): IAction<Property> => {
  return {
    type: UPDATE_CURRENT_PROPERTY,
    payload: data,
  };
};

export const resetCurrentProperty = () => {
  return {
    type: RESET_CURRENT_PROPERTY,
  };
};

export const uploadCurrentPropertyPhotos =
  (data: Property, photoUris: string[]) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: UPLOAD_PROPERTY_PHOTOS });

      let getSignedS3UrlPromises = [];
      let uploadPhotoToS3BucketPromises = [];

      photoUris.forEach(fileUri => {
        const fileType = fileUri.split('.').pop();

        getSignedS3UrlPromises.push(apiRequest({
          method: 'get',
          url: `/files/get-s3-signed-property-photo-url/${data.id}/${fileType}`,
        }));
      });

      const getSignedS3UrlResults = await Promise.all(getSignedS3UrlPromises);
      
      getSignedS3UrlResults.forEach(async (getSignedS3UrlResult, index) => {
        const resp = await fetch(photoUris[index]);
        const fileBody = await resp.blob();

        uploadPhotoToS3BucketPromises.push(fetch(getSignedS3UrlResult.data.url, {
          method: 'PUT',
          body: fileBody,
        }));
      });

      await Promise.all(uploadPhotoToS3BucketPromises);

      var newPhotos = getSignedS3UrlResults.map(x => x.data.fileLocation);
      data.photos = [...data.photos, ...newPhotos];
      
      if (!data.defaultPhoto){
        data.defaultPhoto = data.photos[0];
      }

      await apiRequest({
        method: 'post',
        url: '/properties',
        data,
      });

      dispatch({
        type: UPLOAD_PROPERTY_PHOTOS_SUCCESS,
        payload: data,
      });


    } catch (error) {
      dispatch({
        type: UPLOAD_PROPERTY_PHOTOS_ERROR,
        payload: error,
      });
    }
  };
