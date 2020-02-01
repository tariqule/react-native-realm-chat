//import { User } from '../../utils/interfaces';
//import * as realm from '../../backend/LocalDB';
import * as backend from '../../backend/Mediator';
import {
  NEW_PASSWORD_STATUS_INITIAL,
  NEW_PASSWORD_STATUS_SUCCESS,
  NEW_PASSWORD_STATUS_FAIL,
} from '../../utils/GlobaleStaticVars';
import firebase from 'firebase';

import {
  FULLNAME_CHANGED,
  USERNAME_CHANGED,
  OLD_PASSWORD_CHANGED,
  NEW_PASSWORD_CHANGED,
  NEW_RE_PASSWORD_CHANGED,
  NEW_PASSWORD_STATUS,
  NEW_RE_PASSWORD_STATUS,
  PASWWORD_NOT_MATCH,
  SAVE_PROFILE,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_FAIL,
  SETUP_USER_EMAIL,
  CHECK_PASSWORD_CHANGED,
} from './types';

export const checkPasswordChange = () => {
  return {
    type: CHECK_PASSWORD_CHANGED,
  };
};

export const setupEmail = email => {
  return {
    type: SETUP_USER_EMAIL,
    payload: email,
  };
};

export const fullnameChanged = fullName => {
  return {
    type: FULLNAME_CHANGED,
    payload: fullName,
  };
};

export const usernameChanged = username => {
  return {
    type: USERNAME_CHANGED,
    payload: username,
  };
};

export const oldPasswordChanged = oldPassword => {
  return {
    type: OLD_PASSWORD_CHANGED,
    payload: oldPassword,
  };
};

export const newPasswordChanged = newPassword => {
  return dispatch => {
    dispatch({
      type: NEW_PASSWORD_CHANGED,
      payload: newPassword,
    });
    if (newPassword.length >= 6) {
      dispatch({
        type: NEW_PASSWORD_STATUS,
        payload: NEW_PASSWORD_STATUS_SUCCESS,
      });
    } else {
      dispatch({
        type: NEW_PASSWORD_STATUS,
        payload: NEW_PASSWORD_STATUS_FAIL,
      });
    }
  };
};

export const newRePasswordChanged = (rePassword, password) => {
  return dispatch => {
    dispatch({
      type: NEW_RE_PASSWORD_CHANGED,
      payload: rePassword,
    });
    if (password !== rePassword) {
      dispatch({
        type: PASWWORD_NOT_MATCH,
      });
    }
    if (rePassword.length > 6) {
      dispatch({
        type: NEW_RE_PASSWORD_STATUS,
        payload: NEW_PASSWORD_STATUS_SUCCESS,
      });
    } else {
      dispatch({
        type: NEW_RE_PASSWORD_STATUS,
        payload: NEW_PASSWORD_STATUS_FAIL,
      });
    }
  };
};

export const saveProfile = ({
  email,
  fullName,
  username,
  newPassword,
  changePassword,
}) => {
  var onlineUser = firebase.auth().currentUser;
  if (changePassword) {
    if (onlineUser == null) {
      return dispatch => {
        dispatch({type: SAVE_PROFILE_FAIL});
        saveProfileFail(dispatch, 'You are not online!');
      };
    }

    return dispatch => {
      dispatch({type: SAVE_PROFILE});
      onlineUser.updatePassword(newPassword).then(
        function() {
          onlineUser
            .updateProfile({
              displayName: username,
              //photo:
            })
            .then(
              function() {
                saveProfileSuccess(dispatch);
              },
              function(error) {
                saveProfileFail(dispatch, error);
              },
            );
        },
        function(error) {
          saveProfileFail(dispatch, error);
        },
      );
    };
  } else {
    console.log('update_profile: ' + fullName, username);
    backend.updateProfile({email, fullName, username});
    return dispatch => {
      dispatch({type: SAVE_PROFILE_SUCCESS});
    };
  }
};

const saveProfileFail = (dispatch, error) => {
  dispatch({
    type: SAVE_PROFILE_FAIL,
    payload: error,
  });
};

const saveProfileSuccess = (dispatch, fullName, username, password) => {
  /* let newUser = {
         id: user.id,
         email: user.email,
         fullname: fullname,
         username: username,
         password: password,
     };
     realm.updateUser(newUser);*/
  dispatch({
    type: SAVE_PROFILE_SUCCESS,
    //payload: user
  });
};
