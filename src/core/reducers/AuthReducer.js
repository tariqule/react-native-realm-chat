import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  RE_PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  PASWWORD_NOT_MATCH,
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  rePassword: '',
  loginError: '',
  registerError: '',
  loading: false,
  loggedinUser: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      return {
        ...state,
        email: action.payload,
        loginError: '',
        registerError: '',
      };
    case PASSWORD_CHANGED:
      return {
        ...state,
        password: action.payload,
        loginError: '',
        registerError: '',
      };

    case RE_PASSWORD_CHANGED:
      return {
        ...state,
        rePassword: action.payload,
        registerError: '',
        loginError: '',
      };
    case PASWWORD_NOT_MATCH:
      return {
        ...state,
        loading: false,
        registerError: 'Password not match!',
        loginError: '',
      };

    case LOGIN_USER:
      return {...state, loading: true, loginError: '', registerError: ''};
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        loggedinUser: action.payload,
        loginError: '',
        registerError: '',
        loading: false,
      };
    case LOGIN_USER_FAIL:
      return {
        ...state,
        loginError: 'Authentication Failed! ' + action.payload,
        registerError: '',
        loading: false,
      };

    case REGISTER_USER:
      return {...state, loading: true, registerError: '', loginError: ''};
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        loggedinUser: action.payload,
        registerError: '',
        loginError: '',
      };
    case REGISTER_USER_FAIL:
      return {
        ...state,
        registerError: 'Register Failed! ' + action.payload,
        loginError: '',
        password: '',
        rePassword: '',
        loading: false,
      };

    default:
      return state;
  }
};
