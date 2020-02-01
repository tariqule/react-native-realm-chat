import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/core/reducers';
import App from './src/App';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {Spinner} from 'native-base';
import firebase from 'firebase';

export default class RNChat extends Component {
  componentDidMount() {
    firebase.initializeApp({
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
    });
  }
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
