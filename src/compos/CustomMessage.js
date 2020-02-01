import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Spinner} from 'native-base';
import * as Progress from 'react-native-progress';
import AudioMessage from './AudioMessage';
import * as CONSTANTS from '../utils/GlobaleStaticVars';

export default class CustomMessage extends Component {
  render() {
    const message = this.props.currentMessage;
    if (message.imageProgressMessage === true) {
      return (
        <View
          style={{
            width: 200,
            height: 150,
            borderRadius: 1,
            margin: 3,
          }}>
          <Progress.Circle
            progress={message.progress}
            size={150}
            direction={'counter-clockwise'}
            thickness={10}
            style={{alignItems: 'center'}}
            color={'black'}
            unfilledColor={'white'}
          />
        </View>
      );
    } else if (message.audioProgressMessage === true) {
      return (
        <View style={styles.containerAudioStyle}>
          <Progress.Circle
            progress={message.progress}
            size={30}
            direction={'counter-clockwise'}
            style={{alignItems: 'center', flex: 4}}
            color={'black'}
            unfilledColor={'white'}
          />
          <Progress.Bar
            progress={message.progress}
            style={styles.progressAudioStyle}
            color={'black'}
            unfilledColor={'white'}
            height={7}
          />
        </View>
      );
    } else if (message.type === CONSTANTS.MESSAGE_TYPE_AUDIO) {
      console.log('in audio message!');
      return <AudioMessage audio={message.audio} />;
    }
    {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  containerAudioStyle: {
    width: 210,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  progressAudioStyle: {
    flex: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
  },
  container: {
    flex: 1,
  },
});

CustomMessage.defaultProps = {
  currentMessage: {},
};

CustomMessage.propTypes = {
  currentMessage: React.PropTypes.object,
};
