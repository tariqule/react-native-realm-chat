//import { User } from '../../utils/interfaces';
import * as backend from '../../backend/Mediator';

import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  RE_PASSWORD_CHANGED,
  PASWWORD_NOT_MATCH,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
} from './types';

export const emailChanged = text => {
  return {
    type: EMAIL_CHANGED,
    payload: text,
  };
};

export const passwordChanged = text => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};

export const rePasswordChanged = (rePassword, password) => {
  return dispatch => {
    dispatch({type: RE_PASSWORD_CHANGED});
    if (password !== rePassword) {
      dispatch({
        type: PASWWORD_NOT_MATCH,
      });
    }
  };
};

export const registerUser = (navigation, email, password) => {
  return dispatch => {
    dispatch({type: REGISTER_USER});
    backend.registerUser(navigation, dispatch, email, password);
  };
};

export const signinUser = (navigation, email, password) => {
  return dispatch => {
    dispatch({type: LOGIN_USER});
    backend.signinUser(navigation, dispatch, email, password);
  };
};

/*
const registerUserFail = (dispatch, error) => {
  dispatch({
    type: REGISTER_USER_FAIL,
    payload: error
  });
};

const loginUserFail = (dispatch, error) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: error
  });
};

const loginUserSuccess = (dispatch, email, password, navigation) => {
  console.log('loginUserSuccess:  ');
  let newUser = {
    email: email,
    password: password,
  };
  realm.addUser(newUser);
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: newUser
  });
  navigation.navigate('Consulter');
};
*/

/*
const registerUserSuccess = (dispatch, email, password, navigation) => {
  let newUser = {
    email: email,
    password: password,
  };
  realm.addUser(newUser);
  dispatch({
    type: REGISTER_USER_SUCCESS,
    payload: newUser
  });
  navigation.navigate('Consulter');
};


/*const navigate = (dispatch) => {
  dispatch({
    type: NAVIGATE,
    routeName: 'Consulter'
  });

};*/
