import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Container,
  Content,
  Header,
  Icon,
  Input,
  List,
  Item,
  Left,
  Body,
  Right,
  ListItem,
  Thumbnail,
  Text,
} from 'native-base';
import {updateChatList, searchTextChanged} from '../core/actions';
import * as backend from '../backend/Mediator';

class Chat extends Component {
  static navigationOptions = {
    title: 'Chat',
  };

  componentWillMount() {
    this.props.updateChatList();
  }

  onSearchChat(searchText) {
    this.props.searchTextChanged(searchText, this.props.chatList);
  }

  onOpenConversation(chat) {
    //console.log('data: ' + this.props.loggedinUser, chat.uidFrom, chat.uidTo);
    let user = null;
    if (this.props.loggedinUser.uid == chat.uidFrom) {
      user = backend.getContact(chat.uidTo);
    } else {
      user = backend.getContact(chat.uidFrom);
    }
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
              value={this.props.searchText}
              onChangeText={this.onSearchChat.bind(this)}
            />
            <Icon active name="people" />
          </Item>
        </Header>
        <Content>
          <List
            dataArray={this.props.filteredChatList}
            renderRow={chat => (
              <ListItem
                avatar
                button
                onPress={() => this.onOpenConversation(chat)}>
                <Left>
                  <Thumbnail source={require('../imgz/noimg.png')} />
                </Left>
                <Body>
                  <Text>{chat.title}</Text>
                  <Text note>{chat.lastMsgText}</Text>
                </Body>
                <Right>
                  <Text note>{new Date(chat.lastMsgDate).toDateString()}</Text>
                </Right>
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({chatReducer}) => {
  const {searchText, chatList, filteredChatList, loggedinUser} = chatReducer;
  return {searchText, chatList, filteredChatList, loggedinUser};
};

export default connect(mapStateToProps, {
  updateChatList,
  searchTextChanged,
})(Chat);
