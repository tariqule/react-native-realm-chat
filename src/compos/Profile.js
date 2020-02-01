import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {
  NEW_PASSWORD_STATUS_INITIAL,
  NEW_PASSWORD_STATUS_SUCCESS,
  NEW_PASSWORD_STATUS_FAIL,
} from '../utils/GlobaleStaticVars';
import {
  fullnameChanged,
  usernameChanged,
  oldPasswordChanged,
  newPasswordChanged,
  newRePasswordChanged,
  saveProfile,
  checkPasswordChange,
} from '../core/actions';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Grid,
  Col,
  Spinner,
  Toast,
  Icon,
  Button,
  Text,
  ListItem,
  Left,
  Body,
  Card,
  CardItem,
  CheckBox,
} from 'native-base';
import * as backend from '../backend/Mediator';

class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  componentWillMount() {
    var currentUser = backend.getCurrentLocalUser();
    this.props.email = currentUser.email;
    this.props.fullName = currentUser.fullName;
    this.props.username = currentUser.username;
  }

  onSaveProfile() {
    const {
      userId,
      email,
      username,
      fullName,
      newPassword,
      navigate,
      changePassword,
    } = this.props;
    this.props.saveProfile({
      email,
      username,
      fullName,
      newPassword,
      changePassword,
    });
  }

  onFullnameChange(fullName) {
    this.props.fullnameChanged(fullName);
  }

  onUsernameChange(username) {
    this.props.usernameChanged(username);
  }

  onOldPasswordChange(oldPassword) {
    this.props.oldPasswordChanged(oldPassword);
  }

  onNewPasswordChange(newPassword) {
    this.props.newPasswordChanged(newPassword);
  }

  onNewRePasswordChange(rePassword) {
    this.props.newRePasswordChanged(rePassword, this.props.newPassword);
  }

  onCheckChangePassword() {
    this.props.checkPasswordChange();
  }

  renderSpinner() {
    if (this.props.profileLoading) {
      return <Spinner />;
    } else {
      return (
        <Button full rounded onPress={this.onSaveProfile.bind(this)}>
          <Text>Save</Text>
        </Button>
      );
    }
  }

  renderNewPassword() {
    if (this.props.newPasswordStatus == NEW_PASSWORD_STATUS_INITIAL) {
      return (
        <Item rounded>
          <Input
            placeholder="New Password"
            value={this.props.newPassword}
            secureTextEntry
            onChangeText={this.onNewPasswordChange.bind(this)}
            disabled={!this.props.changePassword}
          />
        </Item>
      );
    } else if (this.props.newPasswordStatus == NEW_PASSWORD_STATUS_SUCCESS) {
      return (
        <Item rounded success>
          <Input
            placeholder="New Password"
            value={this.props.newPassword}
            secureTextEntry
            onChangeText={this.onNewPasswordChange.bind(this)}
            disabled={!this.props.changePassword}
          />
          <Icon name="checkmark-circle" />
        </Item>
      );
    } else if (this.props.newPasswordStatus == NEW_PASSWORD_STATUS_FAIL) {
      return (
        <Item rounded error>
          <Input
            placeholder="New Password"
            value={this.props.newPassword}
            secureTextEntry
            onChangeText={this.onNewPasswordChange.bind(this)}
            disabled={!this.props.changePassword}
          />
          <Icon name="close-circle" />
        </Item>
      );
    }
  }

  renderNewRePassword() {
    if (this.props.newRePasswordStatus == NEW_PASSWORD_STATUS_INITIAL) {
      return (
        <Item rounded>
          <Input
            placeholder="Re-Password"
            value={this.props.newRePassword}
            secureTextEntry
            onChangeText={this.onNewRePasswordChange.bind(this)}
            disabled={!this.props.changePassword}
          />
        </Item>
      );
    } else if (this.props.newRePasswordStatus == NEW_PASSWORD_STATUS_SUCCESS) {
      return (
        <Item rounded success>
          <Input
            placeholder="Re-Password"
            value={this.props.newRePassword}
            secureTextEntry
            onChangeText={this.onNewRePasswordChange.bind(this)}
            disabled={!this.props.changePassword}
          />
          <Icon name="checkmark-circle" />
        </Item>
      );
    } else if (this.props.newRePasswordStatus == NEW_PASSWORD_STATUS_FAIL) {
      <Item rounded error>
        <Input
          placeholder="Re-Password"
          value={this.props.newRePassword}
          secureTextEntry
          onChangeText={this.onNewRePasswordChange.bind(this)}
          disabled={!this.props.changePassword}
        />
        <Icon name="close-circle" />
      </Item>;
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem content>
              <Image
                style={{flex: 1}}
                source={require('../imgz/noimg.png')}
                resizeMode="contain"
              />
            </CardItem>
          </Card>
          <Form>
            <ListItem icon>
              <Left>
                <Icon name="mail" />
              </Left>
              <Body>
                <Text>{this.props.email}</Text>
              </Body>
            </ListItem>
            <Item rounded>
              <Input
                placeholder="Full Name"
                value={this.props.fullName}
                onChangeText={this.onFullnameChange.bind(this)}
              />
            </Item>
            <Item rounded>
              <Input
                placeholder="Username"
                value={this.props.username}
                onChangeText={this.onUsernameChange.bind(this)}
              />
            </Item>
            <Item rounded>
              <Text>Change Password</Text>
              <CheckBox
                checked={this.props.changePassword}
                onPress={this.onCheckChangePassword.bind(this)}
              />
            </Item>
            <Item rounded>
              <Input
                placeholder="Old Password"
                value={this.props.oldPassword}
                secureTextEntry
                onChangeText={this.onOldPasswordChange.bind(this)}
                disabled={!this.props.changePassword}
              />
            </Item>
            {this.renderNewPassword()}
            {this.renderNewRePassword()}
            <Item>
              <Text style={styles.errorTextStyle}>
                {this.props.saveProfileError}
              </Text>
            </Item>
            <Item last>
              <Text style={styles.successTextStyle}>
                {this.props.saveProfileSuccess}
              </Text>
            </Item>

            {this.renderSpinner()}
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
  successTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'green',
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
};

const mapStateToProps = ({profileReducer}) => {
  const {
    userId,
    email,
    fullName,
    username,
    changePassword,
    oldPassword,
    newPassword,
    newRePassword,
    newPasswordStatus,
    newRePasswordStatus,
    saveProfileError,
    saveProfileSuccess,
    profileLoading,
  } = profileReducer;

  return {
    userId,
    email,
    fullName,
    username,
    changePassword,
    oldPassword,
    newPassword,
    newRePassword,
    newPasswordStatus,
    newRePasswordStatus,
    saveProfileError,
    saveProfileSuccess,
    profileLoading,
  };
};

export default connect(mapStateToProps, {
  fullnameChanged,
  usernameChanged,
  oldPasswordChanged,
  newPasswordChanged,
  newRePasswordChanged,
  saveProfile,
  checkPasswordChange,
})(Profile);
