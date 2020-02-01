import {
  SETUP_LOGGEDIN_USER,
  SEARCH_TEXT_CHANGED,
  CHAT_LIST_CHANGED,
  FILTERED_CHAT_LIST_CHANGED,
} from '../actions/types';

const INITIAL_STATE = {
  searchText: '',
  chatList: new Array(),
  filteredChatList: new Array(),
  loggedinUser: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETUP_LOGGEDIN_USER:
      return {...state, loggedinUser: action.payload};
    case SEARCH_TEXT_CHANGED:
      return {...state, searchText: action.payload};
    case CHAT_LIST_CHANGED:
      return {...state, chatList: action.payload};
    case FILTERED_CHAT_LIST_CHANGED:
      return {...state, filteredChatList: action.payload};
    default:
      return state;
  }
};
