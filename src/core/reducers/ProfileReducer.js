import {NEW_PASSWORD_STATUS_INITIAL} from '../../utils/GlobaleStaticVars';
import {
  USERNAME_CHANGED,
  FULLNAME_CHANGED,
  OLD_PASSWORD_CHANGED,
  NEW_PASSWORD_CHANGED,
  NEW_RE_PASSWORD_CHANGED,
  PASWWORD_NOT_MATCH,
  NEW_PASSWORD_STATUS,
  NEW_RE_PASSWORD_STATUS,
  SAVE_PROFILE,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_FAIL,
  SETUP_LOGGEDIN_USER,
  CHECK_PASSWORD_CHANGED,
} from '../actions/types';

const INITIAL_STATE = {
  userId: '',
  email: '',
  username: '',
  fullName: '',
  oldPassword: '',
  newPassword: '',
  newRePassword: '',
  photo: '',
  saveProfileError: '',
  saveProfileSuccess: '',
  changePassword: false,
  profileLoading: false,
  newPasswordStatus: NEW_PASSWORD_STATUS_INITIAL,
  newRePasswordStatus: NEW_PASSWORD_STATUS_INITIAL,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHECK_PASSWORD_CHANGED:
      return {...state, changePassword: !state.changePassword};

    case SETUP_LOGGEDIN_USER:
      return {
        ...state,
        userId: action.payload.userId,
        email: action.payload.email,
        fullName: action.payload.fullName,
        username: action.payload.username,
        photo: action.payload.photo,
      };

    case FULLNAME_CHANGED:
      return {
        ...state,
        fullName: action.payload,
        saveProfileError: '',
        saveProfileSuccess: '',
      };
    case USERNAME_CHANGED:
      return {
        ...state,
        username: action.payload,
        saveProfileError: '',
        saveProfileSuccess: '',
      };

    case OLD_PASSWORD_CHANGED:
      return {
        ...state,
        oldPassword: action.payload,
        saveProfileError: '',
        saveProfileSuccess: '',
      };
    case NEW_PASSWORD_CHANGED:
      return {
        ...state,
        newPassword: action.payload,
        saveProfileError: '',
        saveProfileSuccess: '',
      };
    case NEW_RE_PASSWORD_CHANGED:
      return {
        ...state,
        newRePassword: action.payload,
        saveProfileError: '',
        saveProfileSuccess: '',
      };
    case PASWWORD_NOT_MATCH:
      return {
        ...state,
        saveProfileError: 'Passwords not match!',
        saveProfileSuccess: '',
      };

    case NEW_PASSWORD_STATUS:
      return {...state, newPasswordStatus: action.payload};
    case NEW_RE_PASSWORD_STATUS:
      return {...state, newRePasswordStatus: action.payload};

    case SAVE_PROFILE:
      return {
        ...state,
        saveProfileError: '',
        saveProfileSuccess: '',
        profileLoading: true,
      };
    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        saveProfileError: '',
        profileLoading: false,
        saveProfileSuccess: 'Save Profile Success',
      };
    case SAVE_PROFILE_FAIL:
      return {
        ...state,
        saveProfileError: 'Save Profile Failed! ' + action.payload,
        saveProfileSuccess: '',
        profileLoading: false,
      };

    default:
      return state;
  }
};
