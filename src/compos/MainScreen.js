import React, {Component} from 'react';
import {connect} from 'react-redux';
import Chat from './Chat';
import Contacts from './Contacts';
import Profile from './Profile';
import {StyleSheet, Text, View} from 'react-native';
import firebase from 'firebase';
import * as backend from '../backend/Mediator';
import {startMessagesListener, stopMessagesListener} from '../core/actions';
import {Container, Content, Header, Tab, Tabs} from 'native-base';

class MainScreen extends Component {
  static navigationOptions = {
    title: 'Main',
    header: {
      visible: false,
    },
  };

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //this.props.navigation.navigate('Consulter');
        //this.props.email = user.email;
      } else {
        backend.deleteAll();
        this.props.navigation.navigate('Login');
      }
    });

    //backend.deleteMessages();
  }

  componentDidMount() {
    this.props.startMessagesListener(this.props.loggedinUser);
  }

  componentWillUnmount() {
    this.props.stopMessagesListener();
  }

  handleChangeTab(index) {
    console.log('handletabchange: ' + index);
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container>
        <Tabs onChangeTab={this.handleChangeTab.bind(this)}>
          <Tab heading="Chat">
            <Chat navigate={navigate} />
          </Tab>
          <Tab heading="Contacts">
            <Contacts navigate={navigate} />
          </Tab>
          <Tab heading="Profile">
            <Profile navigate={navigate} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const mapStateToProps = ({mainReducer}) => {
  const {loggedinUser} = mainReducer;
  return {loggedinUser};
};

export default connect(mapStateToProps, {
  startMessagesListener,
  stopMessagesListener,
})(MainScreen);
