import RNFetchBlob from 'react-native-fetch-blob';

//Used in Profile.js
export const NEW_PASSWORD_STATUS_INITIAL = 0;
export const NEW_PASSWORD_STATUS_SUCCESS = 1;
export const NEW_PASSWORD_STATUS_FAIL = 2;

//Message types
export const MESSAGE_TYPE_TEXT = 0;
export const MESSAGE_TYPE_IMAGE = 1;
export const MESSAGE_TYPE_AUDIO = 2;
export const MESSAGE_TYPE_VIDEO = 3;
export const MESSAGE_TYPE_LOCATION = 4;
export const MESSAGE_TYPE_DOCUMENT = 5;

//Message status
export const MESSAGE_STATUS_UNREAD = 0;
export const MESSAGE_STATUS_READ = 1;

//General consts
export const IMAGES_DIRECTORY_ANDROID =
  RNFetchBlob.fs.dirs.PictureDir + '/RNChat/images/';
export const AUDIO_DIRECTORY_ANDROID =
  RNFetchBlob.fs.dirs.MusicDir + '/RNChat/audio/';
export const AUDIO_DIRECTORY_IOS =
  RNFetchBlob.fs.dirs.DocumentDir + '/RNChat/audio/';
export const ANDROID_FILE_PREFIX = 'file://';

//Resord status
export const RECORD_STATUS_STARTED = 0;
export const RECORD_STATUS_STOPED = 1;
export const RECORD_STATUS_HOLD = 2;
