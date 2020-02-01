import {SETUP_LOGGEDIN_USER} from '../actions/types';

const INITIAL_STATE = {
  loggedinUser: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETUP_LOGGEDIN_USER:
      return {...state, loggedinUser: action.payload};
    default:
      return state;
  }
};
