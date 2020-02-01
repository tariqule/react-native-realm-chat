import React, {Component} from 'react';
import {connect} from 'react-redux';
import uuid from 'react-native-uuid';
import * as backend from '../backend/Mediator';
import {
  sendTextMessage,
  setupConversation,
  addContact,
  changeReceiverContactStatus,
  showImageModal,
  hideImageModal,
  imageMessageTextChanged,
  sendImageMessage,
  startRecordingAudio,
  stopRecordingAudio,
  sendAudioMessage,
} from '../core/actions';
import {
  Container,
  Content,
  Header,
  Footer,
  Card,
  CardItem,
  ListItem,
  Item,
  Input,
  Icon,
  Button,
  Text,
  Left,
  Body,
  Right,
  Title,
  Spinner,
  Fab,
} from 'native-base';
import {Platform, View, StyleSheet, Modal, Image} from 'react-native';
import {
  GiftedChat,
  Actions,
  Bubble,
  InputToolbar,
} from 'react-native-gifted-chat';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import ImagePicker from 'react-native-image-crop-picker';
import CustomMessage from './CustomMessage';
import * as CONSTANTS from '../utils/GlobaleStaticVars';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class Conversation extends Component {
  static navigationOptions = {
    title: ({state}) => `${state.params.receiver.username}`,
    header: {
      visible: false,
    },
  };

  constructor(props) {
    super(props);
    this.renderCustomActions = this.renderCustomActions.bind(this);
  }

  componentWillMount() {
    const {uid, username} = this.props.navigation.state.params.receiver;
    let oldMsgs = backend.getMessages(this.props.loggedinUser.uid, uid);
    console.log('old messages: ' + oldMsgs.length);
    this.props.setupConversation(
      username,
      uid,
      GiftedChat,
      this.props.loggedinUser,
      oldMsgs,
    );
    this.props.changeReceiverContactStatus(backend.isContact(uid));
    const {email, photo} = this.props.navigation.state.params.receiver;
    this.props.addContact(uid, username, email, photo);
  }

  onSendTextMessage(messages = []) {
    const {loggedinUser, receiverUID, receiverName, networkStatus} = this.props;
    messages.forEach(message => {
      message.title = receiverName;
      message.uidFrom = loggedinUser.uid;
      message.uidTo = receiverUID;
      this.props.sendTextMessage(message, networkStatus);
    });
  }

  onSendImageMessage() {
    const {loggedinUser, receiverUID, receiverName, networkStatus} = this.props;
    let message = {
      _id: uuid.v4(),
      text: this.props.imageMessageText,
      createdAt: new Date(),
      user: {_id: 1, name: this.props.loggedinUser.username},
      image: this.props.imagePath,
      imageName: this.props.imagePath.substring(
        this.props.imagePath.lastIndexOf('/') + 1,
      ),
      title: receiverName,
      uidFrom: loggedinUser.uid,
      uidTo: receiverUID,
    };
    this.props.sendImageMessage(message, networkStatus);
  }

  onAddContact() {
    //const { uid, username, email, photo } = this.props.navigation.state.params.receiver;
    //this.props.addContact(uid, username, email);
  }

  onOpenImagePicker() {
    console.log('image picker opens');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'photo',
    })
      .then(image => {
        console.log(image);
        this.props.showImageModal(image.path);
      })
      .catch(err => {
        console.log('cancel image picker: ' + err);
      });
  }

  onOpenCameraPicker() {
    console.log('camera picker opens');
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      mediaType: 'photo',
    })
      .then(image => {
        console.log(image);
        this.props.showImageModal(image.path);
      })
      .catch(err => {
        alert('Camera use permission required!');
        console.log('cancel image picker: ' + err);
      });
  }

  onOpenVideoPicker() {
    console.log('video picker opens');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
    })
      .then(video => {
        console.log(video);
        //this.props.showImageModal(video.path);
      })
      .catch(err => {
        console.log('cancel video picker: ' + err);
      });
  }

  onOpenVideoCameraPicker() {
    console.log('video camera picker opens');
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      mediaType: 'video',
    })
      .then(video => {
        console.log(video);
        //this.props.showImageModal(video.path);
      })
      .catch(err => {
        alert('Camera use permission required!');
        console.log('cancel video picker: ' + err);
      });
  }

  onRecordingAudio() {
    console.log('on recording audio');
    if (this.props.recordStatus === CONSTANTS.RECORD_STATUS_STARTED) {
      this.props.stopRecordingAudio();
    } else if (this.props.recordStatus === CONSTANTS.RECORD_STATUS_STOPED) {
      this.props.startRecordingAudio();
    }
  }

  renderAttachmentButton() {
    return (
      <Button onPress={this.onOpenImagePicker.bind(this)}>
        <Icon name="attach" />
      </Button>
    );
  }

  onCloseImageModal() {
    this.props.hideImageModal();
  }

  onImageMessageTextChanged(imageMessageText) {
    this.props.imageMessageTextChanged(imageMessageText);
  }

  renderCustomActions(props) {
    if (this.props.recordStatus == CONSTANTS.RECORD_STATUS_STARTED) {
      return (
        <Button onPress={this.onRecordingAudio.bind(this)} danger>
          <Icon name="ios-recording" />
        </Button>
      );
    } else if (this.props.recordStatus == CONSTANTS.RECORD_STATUS_HOLD) {
      return (
        <Button onPress={this.onRecordingAudio.bind(this)} dark>
          <Icon name="ios-stopwatch" />
        </Button>
      );
    } else if (this.props.recordStatus == CONSTANTS.RECORD_STATUS_STOPED) {
      return (
        <Button onPress={this.onRecordingAudio.bind(this)} success>
          <Icon name="microphone" />
        </Button>
      );
    }
  }

  renderProgress(props) {
    return <CustomMessage {...props} />;
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    );
  }

  renderToolbar(props) {
    if (this.props.isRecording === true) {
      return <Input></Input>;
    } else {
      return <InputToolbar {...props} />;
    }
  }

  /**
     * <MenuOption onSelect={() => this.onOpenVideoCameraPicker()} customStyles={{ flex: 1, alignItems: 'center', }}>
                                          <Icon name='ios-videocam' />
                                      </MenuOption>
                                      <MenuOption onSelect={() => this.onOpenVideoPicker()} customStyles={{ flex: 1, alignItems: 'center', }}>
                                          <Icon name='ios-videocam' />
                                      </MenuOption>
     */
  render() {
    const {uid, username, email} = this.props.navigation.state.params.receiver;
    return (
      <MenuContext
        customStyles={menuContextStyles}
        render={renderers.SlideInMenu}>
        <Container>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{username}</Title>
            </Body>
            <Right>
              <Menu>
                <MenuTrigger customStyles={{flex: 1}}>
                  <Icon name="ios-attach" />
                </MenuTrigger>
                <MenuOptions customStyles={optionsStyles}>
                  <MenuOption
                    onSelect={() => this.onOpenCameraPicker()}
                    customStyles={{flex: 1, alignItems: 'center'}}>
                    <Icon name="ios-camera" />
                  </MenuOption>
                  <MenuOption
                    onSelect={() => this.onOpenImagePicker()}
                    customStyles={{flex: 1, alignItems: 'center'}}>
                    <Icon name="ios-photos" />
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </Right>
          </Header>
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.props.imageModalVisible}
            onRequestClose={() => {
              this.onCloseImageModal();
            }}>
            <KeyboardAwareScrollView>
              <View style={imageModalStyle}>
                <Image
                  source={{uri: this.props.imagePath}}
                  style={imagePreviewStyle}
                  resizeMode="contain"
                />
                <View style={imageViewStyle}>
                  <Input
                    style={inputTextStyle}
                    placeholder="Type a message.."
                    value={this.props.imageMessageText}
                    onChangeText={this.onImageMessageTextChanged.bind(this)}
                  />
                  <Button
                    style={{flex: 2}}
                    rounded
                    outline
                    light
                    bordered
                    onPress={() => this.onSendImageMessage()}>
                    <Text style={{alignItems: 'center'}}>Send</Text>
                    <Icon name="ios-send" />
                  </Button>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </Modal>
          <GiftedChat
            messages={this.props.messages}
            onSend={this.onSendTextMessage.bind(this)}
            user={{
              _id: 1,
              name: this.props.loggedinUser.username,
            }}
            //renderBubble={this.renderBubble}
            renderCustomView={this.renderProgress}
            //renderInputToolbar={this.renderToolbar}
            renderActions={this.renderCustomActions}
          />
        </Container>
      </MenuContext>
    );
  }
}

const optionsStyles = {
  optionsContainer: {
    padding: 5,
    width: 50,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  optionsWrapper: {},
  optionWrapper: {
    margin: 5,
  },
  optionTouchable: {
    activeOpacity: 70,
  },
  optionText: {},
};

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  container: {
    flexDirection: 'row',
  },
  backdrop: {
    opacity: 0.5,
  },
});

const inputTextStyle = {
  flex: 10,
  borderBottomWidth: 1,
  marginLeft: 4,
  color: 'white',
};
const imagePreviewStyle = {
  width: 300,
  height: 400,
  flex: 8,
  alignItems: 'center',
};
const imageViewStyle = {
  flex: 2,
  flexDirection: 'row',
};
const imageModalStyle = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.7)',
};

const menuContextStyles = {
  menuContextWrapper: styles.container,
  backdrop: styles.backdrop,
};

const mapStateToProps = ({conversReducer}) => {
  const {
    currentChat,
    typingText,
    messages,
    message,
    receiverName,
    receiverUID,
    isContact,
    loggedinUser,
    networkStatus,
    imageModalVisible,
    imagePath,
    imageMessageText,
    viewProgress,
    recordStatus,
  } = conversReducer;
  return {
    currentChat,
    typingText,
    messages,
    message,
    receiverName,
    receiverUID,
    isContact,
    loggedinUser,
    networkStatus,
    imageModalVisible,
    imagePath,
    imageMessageText,
    viewProgress,
    recordStatus,
  };
};

export default connect(mapStateToProps, {
  sendTextMessage,
  setupConversation,
  addContact,
  changeReceiverContactStatus,
  showImageModal,
  hideImageModal,
  imageMessageTextChanged,
  sendImageMessage,
  startRecordingAudio,
  stopRecordingAudio,
  sendAudioMessage,
})(Conversation);
