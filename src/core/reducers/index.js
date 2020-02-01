import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import MainReducer from './MainReducer';
import ContactsReducer from './ContactsReducer';
import ConversReducer from './ConversReducer';
import ChatReducer from './ChatReducer';

export default combineReducers({
  authReducer: AuthReducer,
  profileReducer: ProfileReducer,
  mainReducer: MainReducer,
  contactsReducer: ContactsReducer,
  conversReducer: ConversReducer,
  chatReducer: ChatReducer,
});
