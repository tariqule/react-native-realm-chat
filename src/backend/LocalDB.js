import Realm from 'realm';
import uuid from 'react-native-uuid';
import {
  MESSAGE_STATUS_UNREAD,
  MESSAGE_STATUS_READ,
} from '../utils/GlobaleStaticVars';

const currentUser = null;

const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    uid: {type: 'string', optional: true},
    username: {type: 'string', optional: true, default: 'username'},
    fullName: {type: 'string', optional: true, default: 'fullname'},
    email: 'string',
    birthdate: {type: 'date', optional: true},
    photo: {type: 'string', optional: true},
  },
};

const ContactSchema = {
  name: 'Contact',
  properties: {
    uid: {type: 'string', optional: true},
    username: {type: 'string', optional: true},
    fullName: {type: 'string', optional: true},
    email: 'string',
    birthdate: {type: 'date', optional: true},
    photo: {type: 'string', optional: true},
  },
};

const MessageSchema = {
  name: 'Message',
  primaryKey: 'id',
  properties: {
    id: 'string',
    uidFrom: {type: 'string', optional: true},
    uidTo: {type: 'string', optional: true},
    key: {type: 'string', optional: true, default: ''},
    _id: {type: 'string'},
    text: {type: 'string', optional: true, default: ''},
    createdAt: {type: 'int', optional: true},
    status: {type: 'int', default: 0},
    sent: {type: 'bool', default: false},
    received: {type: 'bool', default: false},
    type: {type: 'int', default: 0},
    image: {type: 'string', optional: true, default: ''},
    audio: {type: 'string', optional: true, default: ''},
    video: {type: 'string', optional: true, default: ''},
    location: {type: 'string', optional: true, default: ''},
    document: {type: 'string', optional: true, default: ''},
    sound: {type: 'string', optional: true, default: ''},
  },
};

const MessageQueueSchema = {
  name: 'MessageQueue',
  properties: {
    id: {type: 'string', optional: true},
    uidFrom: {type: 'string', optional: true},
    uidTo: {type: 'string', optional: true},
    key: {type: 'string', optional: true, default: ''},
    _id: {type: 'string', optional: true},
    text: {type: 'string', optional: true, default: ''},
    createdAt: {type: 'int', optional: true},
    status: {type: 'int', default: 0},
    sent: {type: 'bool', default: false},
    received: {type: 'bool', default: false},
    type: {type: 'int', default: 0},
    image: {type: 'string', optional: true, default: ''},
    audio: {type: 'string', optional: true, default: ''},
    video: {type: 'string', optional: true, default: ''},
    location: {type: 'string', optional: true, default: ''},
    document: {type: 'string', optional: true, default: ''},
    sound: {type: 'string', optional: true, default: ''},
  },
};

const ChatSchema = {
  name: 'Chat',
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: {type: 'string', optional: true},
    uidFrom: {type: 'string', optional: true},
    uidTo: {type: 'string', optional: true},
    lastMessageId: {type: 'string', optional: true},
    lastMsgText: {type: 'string', optional: true},
    lastMsgDate: {type: 'int', optional: true},
    status: {type: 'int', default: 0},
    sent: {type: 'bool', default: false},
    received: {type: 'bool', default: false},
    typ: {type: 'int', default: 0},
  },
};

export const realm = new Realm({
  path: 'RNChat.realm',
  schema: [
    UserSchema,
    ContactSchema,
    MessageSchema,
    MessageQueueSchema,
    ChatSchema,
  ],
});

export const generateID = () => {
  return uuid.v1();
};

export const updatePassword = newPassword => {
  currentUser = {...currentUser, password: newPassword};
  updateUser(currentUser);
};

export const getCurrentUser = () => {
  let users = realm.objects('User');
  if (users.length > 0) {
    users.forEach(user => {
      currentUser = user;
    });
  }
  return currentUser;
};

export const addUser = user => {
  currentUser = user;
  realm.write(() => {
    realm.create('User', {
      id: uuid.v1(),
      uid: user.uid,
      email: user.email,
      username: user.email,
    });
  });
};

export const updateUser = ({fullName, username}) => {
  realm.write(() => {
    realm.create(
      'User',
      {
        id: currentUser.id,
        username: username,
        fullName: fullName,
      },
      true,
    );
  });
};

export const addContact = contact => {
  realm.write(() => {
    let contacts = realm.objects('Contact').filtered('uid = $0', contact.uid);
    if (contacts.length <= 0) {
      realm.create('Contact', {
        uid: contact.uid,
        email: contact.email,
        username: contact.username,
        photo: contact.photo,
      });
    }
  });
};

export const saveMessage = message => {
  console.log(
    message.id,
    message.uidFrom,
    message.uidTo,
    message.key,
    message._id,
    message.image,
    message.audio,
  );
  realm.write(() => {
    realm.create('Message', {
      id: message.id,
      uidFrom: message.uidFrom,
      uidTo: message.uidTo,
      key: message.key,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt.getTime(),
      status: message.status,
      type: message.type,
      image: message.image,
      audio: message.audio,
      video: message.video,
      location: message.location,
      sound: message.sound,
      document: message.document,
    });
    updateChat(message);
  });
};

export const updateMessage = message => {
  //console.log(message.id, message.uidFrom, message.uidTo, key, message._id, message.createdAt);
  realm.write(() => {
    realm.create(
      'Message',
      {
        id: message.id,
        key: message.key,
        sent: message.sent,
        status: MESSAGE_STATUS_READ,
      },
      true,
    );
  });
};

export const saveQueueMessage = message => {
  console.log(
    'queue msg: ',
    message.id,
    message.type,
    message.uidFrom,
    message.uidTo,
    message.key,
    message._id,
    message.image,
  );
  realm.write(() => {
    realm.create('MessageQueue', {
      id: message.id,
      uidFrom: message.uidFrom,
      uidTo: message.uidTo,
      key: message.key,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt.getTime(),
      status: message.status,
      type: message.type,
      image: message.image,
      audio: message.audio,
      video: message.video,
      location: message.location,
      sound: message.sound,
      document: message.document,
    });
  });
};

const updateChat = message => {
  let chats = realm
    .objects('Chat')
    .filtered(
      ' ( uidFrom = $0 && uidTo = $1 ) OR ( uidFrom = $1 && uidTo = $0 ) ',
      message.uidFrom,
      message.uidTo,
    );
  //console.log(message.uidFrom, message.uidTo, message._id, message.text, message.createdAt, message.status, message.sent, message.received);
  if (chats.length > 0) {
    chats.forEach(chat => {
      realm.create(
        'Chat',
        {
          id: chat.id,
          uidFrom: message.uidFrom,
          uidTo: message.uidTo,
          _id: message._id,
          lastMessageId: message.id,
          lastMsgText: message.text,
          lastMsgDate: message.createdAt.getTime(),
          title: message.title,
          status: message.status,
          sent: message.sent,
          received: message.received,
        },
        true,
      );
    });
  } else {
    realm.create('Chat', {
      id: uuid.v1(),
      uidFrom: message.uidFrom,
      uidTo: message.uidTo,
      _id: message._id,
      lastMessageId: message.id,
      lastMsgText: message.text,
      lastMsgDate: message.createdAt.getTime(),
      title: message.title,
      status: message.status,
      sent: message.sent,
      received: message.received,
    });
  }
};

export const isContact = uid => {
  let contacts = realm.objects('Contact').filtered('uid = $0', uid);
  if (contacts.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const getContact = uid => {
  let contacts = realm.objects('Contact').filtered('uid = $0', uid);
  let contact = null;
  if (contacts.length > 0) {
    contacts.forEach(cont => {
      contact = cont;
    });
  }
  return contact;
};

export const getContacts = () => {
  return realm.objects('Contact');
};

export const getQueuedMessages = () => {
  let messages = realm.objects('MessageQueue');
  return messages.sorted('createdAt', true);
};

export const getMessages = (uid, uid2) => {
  let messages = realm
    .objects('Message')
    .filtered(
      ' ( uidFrom = $0 && uidTo = $1 ) OR ( uidFrom = $1 && uidTo = $0 ) ',
      uid,
      uid2,
    );
  return messages.sorted('createdAt', true);
};

export const getChats = () => {
  let chats = realm.objects('Chat');
  return chats.sorted('lastMsgDate', true);
};

export const deleteQueueMessage = messageId => {
  realm.write(() => {
    let msg = realm.objects('MessageQueue').filtered('id = $0', messageId);
    realm.delete(msg);
  });
};

export const removeListeners = () => {
  realm.removeAllListeners();
};

export const deleteMessages = () => {
  realm.write(() => {
    let messages = realm.objects('Message');
    realm.delete(messages);
    let messagesQueue = realm.objects('MessageQueue');
    realm.delete(messagesQueue);
  });
};

export const deleteAll = () => {
  realm.write(() => {
    let users = realm.objects('User');
    realm.delete(users);
    let messages = realm.objects('Message');
    realm.delete(messages);
    let messagesQueue = realm.objects('MessageQueue');
    realm.delete(messagesQueue);
  });
};
