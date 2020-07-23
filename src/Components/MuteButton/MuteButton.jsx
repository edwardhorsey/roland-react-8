import React, { Component } from 'react';
import styles from './MuteButton.module.scss';


class MuteButton extends Component {

  render() { 
  return <div className={this.props.muted ? styles.muteButtonOn : styles.muteButtonOff} onClick={this.props.logic}><h2>{this.props.text}</h2></div>
  }
}
 
// Mute: =/-, This.props.title in the text area.

export default MuteButton;