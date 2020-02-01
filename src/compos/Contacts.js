import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {searchNameChanged, updateContactsList} from '../core/actions';
import {
  Container,
  Content,
  Header,
  List,
  ListItem,
  Item,
  Input,
  Thumbnail,
  Body,
  Left,
  Right,
  Icon,
  Button,
  Text,
} from 'native-base';
import * as backend from '../backend/Mediator';

class Contacts extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Contacts',
    header: {
      backTitle: null,
      visible: false,
    },
  };

  componentWillMount() {
    console.log('Contact componentWillMount ');
    this.props.updateContactsList(this.props.loggedinUser.uid);
  }

  componentDidMount() {
    console.log('Contact componentDidMount ');
  }

  componentWillUnmount() {
    console.log('Contact componentWillUnmount ');
  }

  onSearchContact(searchName) {
    this.props.searchNameChanged(searchName, this.props.contactList);
  }

  onOpenConversation(user) {
    console.log('data: ' + user.uid);
    //this.props.openConversation(data);
    this.props.navigate('Conversation', {receiver: user});
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="search" />
            <Input
              placeholder="Search"
              value={this.props.searchName}
              onChangeText={this.onSearchContact.bind(this)}
            />
            <Icon active name="people" />
          </Item>
        </Header>
        <Content>
          <List
            dataArray={this.props.filteredContactList}
            renderRow={user => (
              <ListItem thumbnail>
                <Left>
                  <Thumbnail
                    square
                    size={80}
                    source={require('../imgz/noimg.png')}
                  />
                </Left>
                <Body>
                  <Text>{user.username}</Text>
                  <Text note>{user.email}</Text>
                </Body>
                <Right>
                  <Button
                    transparent
                    onPress={() => this.onOpenConversation(user)}>
                    <Text>Chat</Text>
                  </Button>
                </Right>
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({contactsReducer}) => {
  const {
    searchName,
    contactList,
    filteredContactList,
    loggedinUser,
  } = contactsReducer;
  return {searchName, contactList, filteredContactList, loggedinUser};
};

export default connect(mapStateToProps, {
  searchNameChanged,
  updateContactsList,
})(Contacts);
