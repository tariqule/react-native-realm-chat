import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Button, Text} from 'native-base';
import * as Progress from 'react-native-progress';
import Sound from 'react-native-sound';

export default class AudioMessage extends Component {
  constructor(props) {
    super(props);
    this.onPlayPause = this.onPlayPause.bind(this);
    this.state = {
      sound: null,
      playing: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      progressTimer: null,
    };
  }

  componentWillMount() {
    this.setState({progress: -1});
  }
  onPlayPause() {
    var progressTimer = null;

    if (this.state.playing === true) {
      var sound = this.state.sound;
      sound.stop();
      sound.release();
      this.setState({playing: false, progress: 0});
      if (progressTimer) {
        clearTimeout(progressTimer);
      }
    } else {
      console.log('audio ', this.props.audio);
      var sound = new Sound(this.props.audio, '', error => {
        if (error) {
          console.log('failed to load the sound', error);
        }

        this.setState({
          sound: sound,
          duration: sound.getDuration(),
          playing: true,
        });

        progressTimer = setInterval(() => {
          sound.getCurrentTime(seconds => {
            currentProgress = (1 * seconds) / this.state.duration;
            console.log('seconds ', seconds);
            console.log('currentProgress ', currentProgress);
            this.setState({progress: currentProgress});
          });
        }, 50);

        console.log('play recorded audio');
        sound.play(success => {
          if (success) {
            this.setState({playing: false, progress: 0});
            sound.release();
            if (progressTimer) {
              clearTimeout(progressTimer);
            }
          } else {
            console.log('playback failed due to audio decoding errors');
            this.setState({playing: false, progress: 0});
            if (progressTimer) {
              clearTimeout(progressTimer);
            }
          }
        });
      });
    }
  }

  renderIcon() {
    if (this.state.playing === true) {
      return <Icon name="ios-pause" />;
    }
    return <Icon name="ios-play" />;
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Button
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            height: 30,
          }}
          transparent
          onPress={() => this.onPlayPause()}>
          {this.renderIcon()}
        </Button>
        <Progress.Bar
          progress={this.state.progress}
          style={styles.progressStyle}
          color={'black'}
          unfilledColor={'white'}
          height={7}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    width: 210,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  progressStyle: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
  },
  container: {
    flex: 1,
  },
});
