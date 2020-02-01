import React, {Component} from 'react';
import {connect} from 'react-redux';
import MainScreen from './compos/MainScreen';
import Profile from './compos/Profile';
import Chat from './compos/Chat';
import Register from './compos/Register';
import Login from './compos/Login';
import Conversation from './compos/Conversation';
import Contacts from './compos/Contacts';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {
  setupLoggedinUser,
  networkStatusChanged,
  sendQueuedMessages,
  changeCurrentScreen,
} from './core/actions';
import {Spinner} from 'native-base';
import firebase from 'firebase';
import * as backend from './backend/Mediator';

class App extends Component {
  componentWillMount() {
    let user = backend.getCurrentLocalUser();
    if (user) {
      this.props.setupLoggedinUser(user);
    }

    var connectedRef = firebase.database().ref('.info/connected');
    let self = this;
    connectedRef.on('value', function(snap) {
      if (snap.val() === true) {
        console.log('connected');
        self.props.networkStatusChanged(true);
        self.props.sendQueuedMessages();
      } else {
        console.log('disconnected');
        self.props.networkStatusChanged(false);
      }
    });
  }

  componentDidMount() {}

  getCurrentRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return getCurrentRouteName(route);
    }
    return route.routeName;
  }

  onNavigationChanged(currentScreen) {
    this.props.changeCurrentScreen(currentScreen);
  }

  renderNavigator() {
    const MainNavigator = StackNavigator(
      {
        Main: {screen: MainScreen},
        Chat: {screen: Chat},
        Profile: {screen: Profile},
        Contacts: {screen: Contacts},
        Conversation: {screen: Conversation},
        Login: {screen: Login},
        Register: {screen: Register},
      },
      {headerMode: 'screen'},
    );

    const LoginNavigator = StackNavigator(
      {
        Login: {screen: Login},
        Register: {screen: Register},
        Main: {screen: MainScreen},
        Chat: {screen: Chat},
        Profile: {screen: Profile},
        Contacts: {screen: Contacts},
        Conversation: {screen: Conversation},
      },
      {headerMode: 'screen'},
    );

    if (this.props.loggedinUser) {
      return (
        <MainNavigator
          loggedinUser={this.props.loggedinUser}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getCurrentRouteName(currentState);
            const prevScreen = this.getCurrentRouteName(prevState);
            if (prevScreen !== currentScreen) {
              this.onNavigationChanged(currentScreen);
            }
          }}
        />
      );
    } else {
      return (
        <LoginNavigator
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getCurrentRouteName(currentState);
            const prevScreen = this.getCurrentRouteName(prevState);
            if (prevScreen !== currentScreen) {
              this.onNavigationChanged(currentScreen);
            }
          }}
        />
      );
    }
  }

  render() {
    return this.renderNavigator();
  }
}

const mapStateToProps = ({mainReducer}) => {
  const {loggedinUser} = mainReducer;
  return {loggedinUser};
};

export default connect(mapStateToProps, {
  setupLoggedinUser,
  sendQueuedMessages,
  networkStatusChanged,
  changeCurrentScreen,
})(App);
