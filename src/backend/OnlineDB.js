import firebase from 'firebase';
import {
  MESSAGE_STATUS_UNREAD,
  MESSAGE_STATUS_READ,
} from '../utils/GlobaleStaticVars';
const USERS_REF = '/users';
const CHATS_REF = '/chats';
const PROFILE_REF = '/profile';
const IMAGE_STORAGE_REF = '/images';
const AUDIO_STORAGE_REF = '/audio';

const currentUser = null;
//const contactList = new Array();

export const getCurrentUser = () => {
  currentUser = firebase.auth().currentUser;
  return currentUser;
};
export const creatUser = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const addUser = email => {
  firebase
    .database()
    .ref(`${USERS_REF}/${getCurrentUser().uid}`)
    .set({
      uid: getCurrentUser().uid,
      username: email,
      email: email,
      photo: '',
    });
};

export const signinUser = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const updatePassword = newPassword => {
  return getCurrentUser().updatePassword(newPassword);
};

export const updateProfile = (fullname, username) => {
  return firebase.database().ref(`${USERS_REF}/${getCurrentUser().uid}`);
};

export const getContacts = () => {
  return firebase.database().ref(`${USERS_REF}`);
};

export const getUserRef = uid => {
  return firebase.database().ref(`${USERS_REF}/${uid}`);
};

export const getChatRef = uid => {
  return firebase.database().ref(`${CHATS_REF}/${uid}`);
};

export const getReceiverChatRef = (uidTo, uid) => {
  return firebase.database().ref(`${CHATS_REF}/${uidTo}/${uid}`);
};

export const getUnreadMessagesRef = (uid, uidFrom) => {
  return firebase
    .database()
    .ref(`${CHATS_REF}/${uid}/${uidFrom}`)
    .orderByChild('status')
    .equalTo(MESSAGE_STATUS_UNREAD);
};

export const getMessageRef = (uidTo, uidFrom, msgKey) => {
  return firebase.database().ref(`${CHATS_REF}/${uidTo}/${uidFrom}/${msgKey}`);
};

export const getImageStorageRef = (uid, fileName) => {
  return firebase
    .storage()
    .ref()
    .child(`${IMAGE_STORAGE_REF}/${uid}/${fileName}`);
};

export const getAudioStorageRef = (uid, fileName) => {
  return firebase
    .storage()
    .ref()
    .child(`${AUDIO_STORAGE_REF}/${uid}/${fileName}`);
};
