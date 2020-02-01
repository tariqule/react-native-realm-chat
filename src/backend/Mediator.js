import * as localDB from './LocalDB';
import * as onlineDB from './OnlineDB';
import * as CONSTANTS from '../utils/GlobaleStaticVars';
import RNFetchBlob from 'react-native-fetch-blob';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
//import ImageResizer from 'react-native-image-resizer';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  SETUP_LOGGEDIN_USER,
  MESSAGE_SENT,
  VIEW_PROGRESS_CHANGED,
} from '../core/actions/types';

export const registerUser = (navigation, dispatch, email, password) => {
  onlineDB
    .creatUser(email, password)
    .then(data => {
      var uid = data.uid;
      localDB.addUser({email, password, uid});
      onlineDB.addUser(email);
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {email, password},
      });
      dispatch({
        type: SETUP_LOGGEDIN_USER,
        payload: {
          uid: uid,
          email: email,
          username: email,
        },
      });
      navigation.navigate('MainNav');
    })
    .catch(error => {
      console.log('error: ' + error);
      dispatch({
        type: REGISTER_USER_FAIL,
        payload: error,
      });
    });
};

export const signinUser = (navigation, dispatch, email, password) => {
  onlineDB
    .signinUser(email, password)
    .then(data => {
      var uid = data.uid;
      localDB.addUser({email, password, uid});
      onlineDB.addUser(email);
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {email, password},
      });
      dispatch({
        type: SETUP_LOGGEDIN_USER,
        payload: {
          uid: uid,
          email: email,
          username: email,
        },
      });
      navigation.navigate('Main');
    })
    .catch(error => {
      console.log('error: ' + error);
      dispatch({
        type: LOGIN_USER_FAIL,
        payload: error,
      });
    });
};

export const addContact = contact => {
  localDB.addContact(contact);
};

export const updatePassword = (dispatch, newPassword) => {
  var onlineUser = onlineDB.getCurrentUser();
  if (!onlineUser) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: 'User is not connected',
    });
  }
  onlineDB.updatePassword().then(
    function() {
      localDB.updateUserPassword({newPassword});
      dispatch({
        type: UPDATE_PASSWORD_SUCCESS,
      });
    },
    function(error) {
      dispatch({
        type: UPDATE_PASSWORD_FAIL,
        payload: error,
      });
    },
  );
};

export const updateProfile = ({email, fullName, username}) => {
  onlineDB.updateProfile().set({
    uid: onlineDB.getCurrentUser().uid,
    fullname: fullName,
    username: username,
    photo: '',
    email: email,
  });

  localDB.updateUser({fullName, username});
};

export const getCurrentLocalUser = () => {
  return localDB.getCurrentUser();
};

export const getCurrentOnlineUser = () => {
  return onlineDB.getCurrentUser();
};

export const isContact = uid => {
  return localDB.isContact(uid);
};

export const getLocalContacts = () => {
  return localDB.getContacts();
};

export const getOnlineUsers = () => {
  return onlineDB.getContacts();
};

export const getUserRef = userUid => {
  return onlineDB.getUserRef(userUid);
};

//Chat/Messages
export const sendTextMessage = (message, queuedMessage) => {
  message.received = false;
  message.status = CONSTANTS.MESSAGE_STATUS_UNREAD;
  message.type = CONSTANTS.MESSAGE_TYPE_TEXT;
  var userChatRef = onlineDB
    .getReceiverChatRef(message.uidTo, message.uidFrom)
    .push();
  userChatRef.set({
    _id: message._id,
    text: message.text,
    createdAt: message.createdAt.getTime(),
    status: CONSTANTS.MESSAGE_STATUS_UNREAD,
    type: message.type,
    received: message.received,
  });

  message.key = userChatRef.key;
  message.sent = true;
  if (queuedMessage === true) {
    updateMessage(message);
    localDB.deleteQueueMessage(message.id);
  } else {
    saveMessage(message);
  }
};

export async function sendImageMessage(dispatch, message, queuedMessage) {
  if (Platform.OS === 'android') {
    const granted = await requestExternalPermission();
    if (granted === true) {
      proccessSendingImage(dispatch, message, queuedMessage);
      //sendThumbnailImage(dispatch, message);
    } else {
      console.log('Permission denied');
      alert(
        'You cant send/recieve pictures unless you grant RNChat app external storage permission',
      );
    }
  } else {
    proccessSendingImage(dispatch, message, queuedMessage);
  }
}

const proccessSendingImage = (dispatch, message, queuedMessage) => {
  message.received = false;
  message.status = CONSTANTS.MESSAGE_STATUS_UNREAD;
  message.type = CONSTANTS.MESSAGE_TYPE_IMAGE;
  var imageName = getFileNameFromPath(message.image);
  var newImageRef = onlineDB.getImageStorageRef(message.uidTo, imageName);
  var mime = 'image/jpeg';
  let uploadBlob = null;
  var messageText = message.text;
  var messageImage = message.image;
  RNFetchBlob.fs
    .readFile(messageImage.replace(CONSTANTS.ANDROID_FILE_PREFIX, ''), 'base64')
    .then(data => {
      return Blob.build(data, {type: `${mime};BASE64`});
    })
    .then(blob => {
      uploadBlob = blob;
      newImageRef.put(blob, {contentType: mime}).on(
        'state_changed',
        function(snapshot) {
          message.text = 'Uploading image...';
          message.imageProgressMessage = true;
          message.image = undefined;
          if (snapshot.bytesTransferred < snapshot.totalBytes) {
            message.progress = snapshot.bytesTransferred / snapshot.totalBytes;
            console.log('Upload is ' + message.progress + '% done');
            dispatch({
              type: MESSAGE_SENT,
              message: message,
            });
          }
        },
        function(error) {
          console.log('error uploading photo: ' + err);
        },
        function() {
          uploadBlob.close();
          console.log('image uploaded');
          message.text = messageText;
          message.image = messageImage;
          var userChatRef = onlineDB
            .getReceiverChatRef(message.uidTo, message.uidFrom)
            .push();
          userChatRef.set({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt.getTime(),
            status: CONSTANTS.MESSAGE_STATUS_UNREAD,
            type: message.type,
            image: imageName,
            received: message.received,
          });

          message.key = userChatRef.key;
          message.sent = true;
          message.imageProgressMessage = false;
          if (queuedMessage === true) {
            localDB.updateMessage(message);
            localDB.deleteQueueMessage(message.id);
          } else {
            saveMessage(message);
          }
          dispatch({
            type: MESSAGE_SENT,
            message: message,
          });
        },
      );
    });
};

export async function sendAudioMessage(dispatch, message, queuedMessage) {
  if (Platform.OS === 'android') {
    const granted = await requestExternalPermission();
    if (granted === true) {
      proccessSendingAudio(dispatch, message, queuedMessage);
    } else {
      console.log('Permission denied');
      alert(
        'You cant send/recieve audio unless you grant RNChat app external storage permission',
      );
    }
  } else {
    proccessSendingAudio(dispatch, message, queuedMessage);
  }
}

const proccessSendingAudio = (dispatch, message, queuedMessage) => {
  message.received = false;
  message.status = CONSTANTS.MESSAGE_STATUS_UNREAD;
  message.type = CONSTANTS.MESSAGE_TYPE_AUDIO;
  var audioName = getFileNameFromPath(message.audio);
  var newImageRef = onlineDB.getAudioStorageRef(message.uidTo, audioName);
  var mime = 'audio/aac';
  let uploadBlob = null;
  //var messageText = message.text;
  var messageAudio = message.audio;
  RNFetchBlob.fs
    .readFile(messageAudio.replace(CONSTANTS.ANDROID_FILE_PREFIX, ''), 'base64')
    .then(data => {
      return Blob.build(data, {type: `${mime};BASE64`});
    })
    .then(blob => {
      uploadBlob = blob;
      newImageRef.put(blob, {contentType: mime}).on(
        'state_changed',
        function(snapshot) {
          message.text = 'Uploading audio...';
          message.audioProgressMessage = true;
          //message.audio = undefined;
          //console.log('Upload is ', snapshot.bytesTransferred, '/', snapshot.totalBytes);
          if (snapshot.bytesTransferred < snapshot.totalBytes) {
            message.progress = snapshot.bytesTransferred / snapshot.totalBytes;
            console.log('Upload is ' + message.progress + '% done');
            dispatch({
              type: MESSAGE_SENT,
              message: message,
            });
          }
        },
        function(error) {
          console.log('error uploading audio: ' + err);
        },
        function() {
          uploadBlob.close();
          console.log('audio uploaded');
          message.text = '';
          message.audio = messageAudio;
          var userChatRef = onlineDB
            .getReceiverChatRef(message.uidTo, message.uidFrom)
            .push();
          userChatRef.set({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt.getTime(),
            status: CONSTANTS.MESSAGE_STATUS_UNREAD,
            type: message.type,
            audio: audioName,
            received: message.received,
          });

          message.key = userChatRef.key;
          message.sent = true;
          message.audioProgressMessage = false;
          message.audioMessage = true;
          if (queuedMessage === true) {
            localDB.updateMessage(message);
            localDB.deleteQueueMessage(message.id);
          } else {
            saveMessage(message);
          }
          console.log('audio message sent!');
          dispatch({
            type: MESSAGE_SENT,
            message: message,
          });
        },
      );
    });
};

export const getImageDownloadURL = (uid, fileName) => {
  return onlineDB.getImageStorageRef(uid, fileName).getDownloadURL();
};

export const getAudioDownloadURL = (uid, fileName) => {
  return onlineDB.getAudioStorageRef(uid, fileName).getDownloadURL();
};

export const sendQueuedMessage = (dispatch, message) => {
  message.user = {_id: 1, name: '', avatar: ''};
  switch (message.type) {
    case CONSTANTS.MESSAGE_TYPE_TEXT:
      sendTextMessage(message, true);
      break;
    case CONSTANTS.MESSAGE_TYPE_IMAGE:
      sendImageMessage(dispatch, copyMessage(message), true);
      break;
    case CONSTANTS.MESSAGE_TYPE_AUDIO:
      sendAudioMessage(dispatch, copyMessage(message), true);
      break;
    default:
  }
};

export const updateMessage = message => {
  var messageRef = onlineDB.getMessageRef(
    message.uidTo,
    message.uidFrom,
    message.key,
  );
  messageRef.update({
    status: CONSTANTS.MESSAGE_STATUS_READ,
    received: true,
  });
};

export const saveMessage = message => {
  if (!message.id) {
    message.id = localDB.generateID();
  }
  localDB.saveMessage(message);
};

export const saveQueuedMessage = message => {
  message.id = localDB.generateID();
  message.key = '';
  message.sent = false;
  message.received = false;
  message.status = CONSTANTS.MESSAGE_STATUS_UNREAD;
  saveMessage(message);
  localDB.saveQueueMessage(message);
};

export const getChats = () => {
  return localDB.getChats();
};

export const getContact = uid => {
  return localDB.getContact(uid);
};

export const getChatRef = uid => {
  return onlineDB.getChatRef(uid);
};

export const getUnreadMessagesRef = (uid, uidFrom) => {
  return onlineDB.getUnreadMessagesRef(uid, uidFrom);
};

export const getQueuedMessages = () => {
  return localDB.getQueuedMessages();
};

export const getMessages = (uid, uid2) => {
  return localDB.getMessages(uid, uid2);
};

export const deleteAll = () => {
  return localDB.deleteAll();
};

export const deleteMessages = () => {
  localDB.deleteMessages();
};

export const getFileNameFromPath = path => {
  return path.substring(path.lastIndexOf('/') + 1);
};

async function requestExternalPermission() {
  const readPerm = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  const writePerm = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  if (readPerm === true && writePerm === true) {
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

const copyMessage = message => {
  return {
    id: message.id,
    _id: message._id,
    key: message.key,
    uidFrom: message.uidFrom,
    uidTo: message.uidTo,
    text: message.text,
    createdAt: new Date(message.createdAt),
    user: message.user,
    status: message.status,
    sent: message.sent,
    received: message.received,
    type: message.type,
    image: message.image,
    audio: message.audio,
    video: message.video,
    localDB: message.localDB,
    sound: message.sound,
    document: message.document,
  };
};
