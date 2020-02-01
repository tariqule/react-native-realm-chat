export const getEmptyMessage = () => {
  return {
    id: '',
    _id: '',
    key: '',
    text: '',
    createdAt: new Date(),
    user: {_id: 1, name: ''},
    status: 0,
    sent: false,
    received: false,
    image: '',
    title: '',
    uidFrom: '',
    uidTo: '',
    video: '',
    location: '',
    sound: '',
    document: '',
  };
};
