import {
  SETUP_LOGGEDIN_USER,
  MESSAGE_SENT,
  MESSAGE_RECEIVED,
  OPEN_CONVERSATION,
  SETUP_CONVERSATION,
  NETWORK_STATUS_CHANGED,
  IS_RECEIVER_CONTACT,
  SETUP_OLD_MESSAGES,
  IMAGE_MODAL_CHANGED,
  IMAGE_MESSAGE_TEXT_CHANGED,
  VIEW_PROGRESS_CHANGED,
  RECORD_AUDIO_STARTED,
  RECORD_AUDIO_STOPPED,
  RECORD_AUDIO_HOLD,
} from '../actions/types';
import * as CONSTANTS from '../../utils/GlobaleStaticVars';

const INITIAL_STATE = {
  currentChat: null,
  typingText: '',
  message: '',
  receiverName: '',
  receiverUID: '',
  isContact: false,
  messages: new Array(),
  loggedinUser: null,
  networkStatus: false,
  active: false,
  imageModalVisible: false,
  imagePath: '../imgz/noimg.png',
  imageMessageText: '',
  viewProgress: false,
  recordStatus: CONSTANTS.RECORD_STATUS_STOPED,
  audioPath: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECORD_AUDIO_STARTED:
      return {...state, recordStatus: CONSTANTS.RECORD_STATUS_STARTED};
    case RECORD_AUDIO_HOLD:
      return {...state, recordStatus: CONSTANTS.RECORD_STATUS_HOLD};
    case RECORD_AUDIO_STOPPED:
      return {
        ...state,
        recordStatus: CONSTANTS.RECORD_STATUS_STOPED,
        audioPath: action.payload,
      };
    case VIEW_PROGRESS_CHANGED:
      return {...state, viewProgress: action.payload};
    case IMAGE_MESSAGE_TEXT_CHANGED:
      return {...state, imageMessageText: action.payload};
    case IMAGE_MODAL_CHANGED:
      return {
        ...state,
        imageModalVisible: action.imageModalVisible,
        imagePath: action.imagePath,
      };
    case IS_RECEIVER_CONTACT:
      return {...state, isContact: action.payload};
    case NETWORK_STATUS_CHANGED:
      return {...state, networkStatus: action.payload};
    case SETUP_LOGGEDIN_USER:
      return {...state, loggedinUser: action.payload};
    case SETUP_OLD_MESSAGES:
      return {
        ...state,
        ...state,
        messages: state.currentChat.append(new Array(), action.payload),
      };
    case MESSAGE_RECEIVED:
      if (state.receiverUID == action.message.uidFrom) {
        return {
          ...state,
          messages: state.currentChat.append(state.messages, action.message),
        };
      } else {
        return {...state};
      }
    case MESSAGE_SENT:
      return {
        ...state,
        imageMessageText: '',
        messages: state.currentChat.append(state.messages, action.message),
      };
    case SETUP_CONVERSATION:
      return {
        ...state,
        receiverName: action.payload.name,
        receiverUID: action.payload.uid,
        currentChat: action.payload.currentChat,
      };
    case OPEN_CONVERSATION:
      return {
        ...state,
        receiverName: action.payload.username,
        receiverUID: action.payload.uid,
      };
    default:
      return state;
  }
};
