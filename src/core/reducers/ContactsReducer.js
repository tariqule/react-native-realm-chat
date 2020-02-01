import {
  SETUP_LOGGEDIN_USER,
  SEARCH_NAME_CHANGED,
  CONTACTS_LIST_UPDATED,
  FILTERED_CONTACTS_LIST_CHANGED,
} from '../actions/types';

const INITIAL_STATE = {
  searchName: '',
  contactList: new Array(),
  filteredContactList: new Array(),
  loggedinUser: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETUP_LOGGEDIN_USER:
      return {...state, loggedinUser: action.payload};
    case SEARCH_NAME_CHANGED:
      return {...state, searchName: action.payload};
    case CONTACTS_LIST_UPDATED:
      return {...state, contactList: action.payload};
    case FILTERED_CONTACTS_LIST_CHANGED:
      return {...state, filteredContactList: action.payload};
    default:
      return state;
  }
};
