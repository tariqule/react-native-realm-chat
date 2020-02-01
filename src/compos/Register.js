import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  emailChanged,
  passwordChanged,
  rePasswordChanged,
  registerUser,
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
} from 'native-base';

class Register extends Component {
  static navigationOptions = {
    title: 'Register',
  };

  onRegister() {
    const {email, password, rePassword, navigation} = this.props;
    this.props.registerUser(navigation, email, password);
  }

  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onRePasswordChange(text) {
    this.props.rePasswordChanged(text, this.props.password);
  }

  renderSpinner() {
    if (this.props.loading) {
      return <Spinner />;
    } else {
      return (
        <Button full rounded onPress={this.onRegister.bind(this)}>
          <Text>Register</Text>
        </Button>
      );
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container>
        <Content>
          <Form>
            <Item rounded>
              <Input
                placeholder="E-Mail"
                value={this.props.email}
                onChangeText={this.onEmailChange.bind(this)}
              />
            </Item>
            <Item rounded>
              <Input
                placeholder="Password"
                value={this.props.password}
                secureTextEntry
                onChangeText={this.onPasswordChange.bind(this)}
              />
            </Item>
            <Item rounded>
              <Input
                placeholder="Re-Password"
                value={this.props.rePassword}
                secureTextEntry
                onChangeText={this.onRePasswordChange.bind(this)}
              />
            </Item>
            <Item>
              <Text style={styles.errorTextStyle}>
                {this.props.registerError}
              </Text>
            </Item>
            <Item last>{this.renderSpinner()}</Item>
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
};

const mapStateToProps = ({authReducer}) => {
  const {email, password, rePassword, registerError, loading} = authReducer;
  return {email, password, rePassword, registerError, loading};
};

export default connect(mapStateToProps, {
  emailChanged,
  passwordChanged,
  rePasswordChanged,
  registerUser,
})(Register);
