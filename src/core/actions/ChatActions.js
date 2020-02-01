import * as backend from '../../backend/Mediator';
import {Map} from 'immutable';

import {
  SEARCH_TEXT_CHANGED,
  CHAT_LIST_CHANGED,
  FILTERED_CHAT_LIST_CHANGED,
  OPEN_CONVERSATION,
} from './types';

export const searchTextChanged = (searchText, chatList) => {
  return dispatch => {
    dispatch({
      type: SEARCH_TEXT_CHANGED,
      payload: searchText,
    });

    var filteredChatList = new Array();
    if (searchText) {
      chatList.filter(item => {
        if (item.title.toLowerCase().includes(searchText.toLowerCase())) {
          filteredChatList.push(item);
        }
      });
    } else {
      filteredChatList = backend.getChats();
    }

    console.log('filtered lista: ' + filteredChatList.length);
    dispatch({
      type: FILTERED_CHAT_LIST_CHANGED,
      payload: filteredChatList,
    });
  };
};

export const updateChatList = () => {
  var chatList = backend.getChats();
  console.log('chatList : ' + chatList.length);

  return dispatch => {
    dispatch({
      type: CHAT_LIST_CHANGED,
      payload: chatList,
    });

    dispatch({
      type: FILTERED_CHAT_LIST_CHANGED,
      payload: chatList,
    });

    backend.getChats().addListener(() => {
      chatList = backend.getChats();
      dispatch({
        type: FILTERED_CHAT_LIST_CHANGED,
        payload: chatList,
      });
    });
  };
};
