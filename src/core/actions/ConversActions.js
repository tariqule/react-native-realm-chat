import * as backend from '../../backend/Mediator';
import * as CONSTANTS from '../../utils/GlobaleStaticVars';
import {PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import {
  MESSAGE_SENT,
  SETUP_CONVERSATION,
  IS_RECEIVER_CONTACT,
  SETUP_OLD_MESSAGES,
  IMAGE_MODAL_CHANGED,
  IMAGE_MESSAGE_TEXT_CHANGED,
  VIEW_PROGRESS_CHANGED,
  EMPTY_ACTION,
  RECORD_AUDIO_STARTED,
  RECORD_AUDIO_STOPPED,
  RECORD_AUDIO_HOLD,
} from './types';
import uuid from 'react-native-uuid';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import Video from 'react-native-video';

const userMessagesRef = null;
const loggedinUser = null;
const receiverName = '';
const receiverUID = '';

export const sendTextMessage = (message, networkStatus) => {
  message.type = CONSTANTS.MESSAGE_TYPE_TEXT;
  if (networkStatus) {
    backend.sendTextMessage(message, false);
  } else {
    backend.saveQueuedMessage(message);
  }

  return dispatch => {
    dispatch({
      type: MESSAGE_SENT,
      message: message,
    });
  };
};

export const sendImageMessage = (message, networkStatus) => {
  console.log('send image message');
  message.type = CONSTANTS.MESSAGE_TYPE_IMAGE;
  return dispatch => {
    if (networkStatus) {
      backend.sendImageMessage(dispatch, message, false);
    } else {
      backend.saveQueuedMessage(message);
    }
    dispatch(hideImageModal());
    dispatch({
      type: MESSAGE_SENT,
      message: message,
    });
  };
};

export const setupConversation = (
  receiverName,
  receiverUID,
  currentChat,
  loggedinUser,
  oldMessages,
) => {
  return dispatch => {
    //console.log('img uri: ' + oldMessages[0].image);
    this.loggedinUser = loggedinUser;
    this.receiverUID = receiverUID;
    this.receiverName = receiverName;

    dispatch({
      type: SETUP_CONVERSATION,
      payload: {name: receiverName, uid: receiverUID, currentChat: currentChat},
    });
    setupOldMessages(dispatch, oldMessages, loggedinUser, receiverName);
  };
};

const setupOldMessages = (
  dispatch,
  oldMessages,
  loggedinUser,
  receiverName,
) => {
  let messages = new Array();
  oldMessages.forEach(message => {
    if (message.uidFrom == loggedinUser.uid) {
      message.user = {_id: 1, name: loggedinUser.username};
    } else {
      message.user = {_id: 2, name: receiverName};
    }
    messages.push(message);
  });

  dispatch({
    type: SETUP_OLD_MESSAGES,
    payload: messages,
  });
};

export const addContact = (uid, email, username, photo) => {
  backend.addContact({uid, email, username, photo});
  console.log('contact added ');
  return changeReceiverContactStatus(true);
};

export const changeReceiverContactStatus = isContact => {
  return {
    type: IS_RECEIVER_CONTACT,
    payload: isContact,
  };
};

export const showImageModal = imagePath => {
  return dispatch => {
    dispatch({
      type: EMPTY_ACTION,
    });
    proccessModal(dispatch, imagePath);
  };
};

async function proccessModal(dispatch, imagePath) {
  if (Platform.OS === 'android') {
    const granted = await requestExternalPermission();
    if (granted === true) {
      let imgName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
      let newPath = CONSTANTS.IMAGES_DIRECTORY_ANDROID + imgName;
      if (
        imagePath.startsWith(
          CONSTANTS.ANDROID_FILE_PREFIX + CONSTANTS.IMAGES_DIRECTORY_ANDROID,
        ) === true
      ) {
        dispatch({
          type: IMAGE_MODAL_CHANGED,
          imageModalVisible: true,
          imagePath: imagePath,
        });
      } else {
        RNFetchBlob.fs
          .cp(imagePath.replace(CONSTANTS.ANDROID_FILE_PREFIX, ''), newPath)
          .then(() => {
            newPath = CONSTANTS.ANDROID_FILE_PREFIX + newPath;
            console.log('image copied: ' + newPath);
            dispatch({
              type: IMAGE_MODAL_CHANGED,
              imageModalVisible: true,
              imagePath: imagePath,
            });
          })
          .catch(error => {
            console.log('mv error: ' + error);
          });
      }
    } else {
      console.log('Permission denied');
      alert(
        'You cant send/recieve pictures unless you grant RNChat app external storage permission',
      );
      dispatch({
        type: EMPTY_ACTION,
      });
    }
  } else {
    dispatch({
      type: IMAGE_MODAL_CHANGED,
      imageModalVisible: true,
      imagePath: imagePath,
    });
  }
}

export const hideImageModal = () => {
  return {
    type: IMAGE_MODAL_CHANGED,
    imageModalVisible: false,
    imagePath: '',
  };
};

export const imageMessageTextChanged = imageMessageText => {
  return {
    type: IMAGE_MESSAGE_TEXT_CHANGED,
    payload: imageMessageText,
  };
};

export const startRecordingAudio = () => {
  prepareRecordingPath(
    RNFetchBlob.fs.dirs.CacheDir + '/' + new Date().getTime() + '.aac',
  );
  console.log('recording audio started');
  return dispatch => {
    dispatch({
      type: RECORD_AUDIO_STARTED,
    });
    prepareRecordingAudio(dispatch);
  };
};

async function prepareRecordingAudio(dispatch) {
  if (Platform.OS === 'android') {
    const granted = await requestExternalPermission();
    if (granted === true) {
      console.log('record audio permission granted');
      proccessStartRecordingAudio(dispatch);
    } else {
      console.log('Permission denied');
      alert(
        'You cant send/recieve audio unless you grant RNChat app audio record permission',
      );
      dispatch({
        type: EMPTY_ACTION,
      });
    }
  } else {
    proccessStartRecordingAudio(dispatch);
  }
}

async function proccessStartRecordingAudio(dispatch) {
  AudioRecorder.onProgress = data => {
    //this.setState({ currentTime: Math.floor(data.currentTime) });
    console.log('progress recording audio');
  };

  AudioRecorder.onFinished = data => {
    console.log('onFinish recording audio');
    if (Platform.OS === 'ios') {
      finishedRecordingAudio(dispatch, data.status === 'OK', data.audioFileURL);
    }
  };

  try {
    const filePath = await AudioRecorder.startRecording();
  } catch (error) {
    console.error('Error start recording audio', error);
  }
}

export const stopRecordingAudio = () => {
  console.log('recording audio stopped');

  return dispatch => {
    dispatch({
      type: RECORD_AUDIO_HOLD,
    });
    proccessStopRecordingAudio(dispatch);
  };
};

async function proccessStopRecordingAudio(dispatch) {
  try {
    const filePath = await AudioRecorder.stopRecording();
    if (Platform.OS === 'android') {
      finishedRecordingAudio(dispatch, true, filePath);
    }
  } catch (error) {
    console.error(error);
  }
}

const finishedRecordingAudio = (dispatch, success, audioFilePath) => {
  console.log('finished recording: ', success, audioFilePath);
  let message = {
    _id: uuid.v4(),
    createdAt: new Date(),
    user: {_id: 1, name: this.loggedinUser.username},
    title: this.receiverName,
    uidFrom: this.loggedinUser.uid,
    uidTo: this.receiverUID,
    audio: audioFilePath,
  };

  sendAudioMessage(dispatch, message);
};

const sendAudioMessage = (dispatch, message) => {
  if (Platform.OS === 'android') {
    let fileName = backend.getFileNameFromPath(message.audio);
    let newPath = CONSTANTS.AUDIO_DIRECTORY_ANDROID + fileName;
    RNFetchBlob.fs
      .cp(message.audio, newPath)
      .then(() => {
        message.audio = newPath;
        backend.sendAudioMessage(dispatch, message, false);
      })
      .catch(error => {
        console.log('mv error: ' + error);
      });
  } else if (Platform.OS === 'ios') {
    {
      let fileName = backend.getFileNameFromPath(message.audio);
      let newPath = CONSTANTS.AUDIO_DIRECTORY_IOS + fileName;
      RNFetchBlob.fs
        .cp(message.audio, newPath)
        .then(() => {
          message.audio = newPath;
          backend.sendAudioMessage(dispatch, message, false);
        })
        .catch(error => {
          console.log('mv error: ' + error);
        });
    }
  }

  /*if (networkStatus) {
        backend.sendAudioMessage(message, false);
    } else {
        backend.saveQueuedMessage(message);
    }*/
  console.log('audioFilePath: ', message.audio);
  dispatch({
    type: RECORD_AUDIO_STOPPED,
    payload: message.audio,
  });
};

const prepareRecordingPath = audioPath => {
  AudioRecorder.prepareRecordingAtPath(audioPath, {
    SampleRate: 22050,
    Channels: 1,
    AudioQuality: 'Low',
    AudioEncoding: 'aac',
    AudioEncodingBitRate: 32000,
  });
};

async function requestAudioRecordPermission() {
  var audioRecordPerm = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  );

  if (audioRecordPerm) {
    return true;
  } else {
    var granted = null;
    try {
      granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ],
        {
          title: 'RNChat App Needs Record Audio Permission',
          message:
            'RNChat app needs access to your mic ' +
            'so you can send/recieve audio.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}

async function requestExternalPermission() {
  var readPerm = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  var writePerm = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  if (readPerm && writePerm) {
    return true;
  } else {
    var granted = null;
    try {
      granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ],
        {
          title: 'RNChat App Needs External Permission',
          message:
            'RNChat app needs access to your external storage ' +
            'so you can send/recieve pictures.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}
