import React, {Component} from 'react';
import {connect} from 'react-redux';
import {emailChanged, passwordChanged, signinUser} from '../core/actions';
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

class Login extends Component {
  static navigationOptions = {
    title: 'Login',
    header: {
      backTitle: null,
      visible: false,
    },
  };

  onLogin() {
    const {email, password, navigation} = this.props;
    this.props.signinUser(navigation, email, password);
  }

  onRegister() {
    this.props.navigation.navigate('Register');
  }

  componentWillMount() {}

  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  renderSpinner() {
    if (this.props.loading) {
      return <Spinner />;
    } else {
      return (
        <Grid>
          <Col>
            <Button full rounded onPress={this.onLogin.bind(this)}>
              <Text>Login</Text>
            </Button>
          </Col>
          <Col>
            <Button full rounded onPress={this.onRegister.bind(this)}>
              <Text>Register</Text>
            </Button>
          </Col>
        </Grid>
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
                keyboardType="email-address"
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
            <Item>
              <Text style={styles.errorTextStyle}>{this.props.loginError}</Text>
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
  imageStyle: {
    width: 50,
    height: 50,
  },
};

const mapStateToProps = ({authReducer}) => {
  const {email, password, loginError, loading} = authReducer;
  return {email, password, loginError, loading};
};

export default connect(mapStateToProps, {
  emailChanged,
  passwordChanged,
  signinUser,
})(Login);
