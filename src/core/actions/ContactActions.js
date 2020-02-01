import * as backend from '../../backend/Mediator';
import {Map} from 'immutable';

import {
  SEARCH_NAME_CHANGED,
  CONTACTS_LIST_UPDATED,
  FILTERED_CONTACTS_LIST_CHANGED,
  OPEN_CONVERSATION,
} from './types';

export const searchNameChanged = (searchName, contactList) => {
  return dispatch => {
    dispatch({
      type: SEARCH_NAME_CHANGED,
      payload: searchName,
    });

    console.log('contactList lista: ' + contactList.length);
    var filteredContactList = new Array();
    if (searchName) {
      contactList.filter(item => {
        if (item.username.toLowerCase().includes(searchName.toLowerCase())) {
          filteredContactList.push(item);
        }
      });
    } else {
      filteredContactList = backend.getLocalContacts();
    }

    console.log('filtered lista: ' + filteredContactList.length);
    dispatch({
      type: FILTERED_CONTACTS_LIST_CHANGED,
      payload: filteredContactList,
    });
  };
};

export const updateContactsList = loggedinUid => {
  var contactList = new Array();
  var contactMap = new Map();

  backend.getLocalContacts().forEach(contact => {
    contactList.push({
      uid: contact.uid,
      username: contact.username,
      email: contact.email,
      photo: contact.photo,
    });
    contactMap = contactMap.set(contact.uid, {
      uid: contact.uid,
      username: contact.username,
      email: contact.email,
      photo: contact.photo,
    });
  });
  console.log('local contacts: ' + contactList.length);
  return dispatch => {
    dispatch({
      type: CONTACTS_LIST_UPDATED,
      payload: contactList,
    });

    dispatch({
      type: FILTERED_CONTACTS_LIST_CHANGED,
      payload: contactList,
    });
    loadOnlineUsers(dispatch, contactMap, loggedinUid);
  };
};

const loadOnlineUsers = (dispatch, contactMap, loggedinUid) => {
  backend.getOnlineUsers().once('value', function(snapshot) {
    snapshot.forEach(function(userSnapshot) {
      var userKey = userSnapshot.key;
      var userData = userSnapshot.val();
      if (userData.uid != loggedinUid) {
        contactMap = contactMap.set(userData.uid, {
          uid: userData.uid,
          username: userData.username,
          email: userData.email,
          photo: userData.photo,
        });
      }
    });
    console.log('online contacts: ' + contactMap.size);
    dispatch({
      type: CONTACTS_LIST_UPDATED,
      payload: contactMap.toArray(),
    });
  });
};
/*export const openConversation = (recieverUser) => {
    return (dispatch) => {
        dispatch({
            type: OPEN_CONVERSATION,
            payload: recieverUser
        });
    }
}*/
