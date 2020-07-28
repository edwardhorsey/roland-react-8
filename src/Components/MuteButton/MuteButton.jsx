import React, { Component } from 'react';
import styles from './MuteButton.module.scss';


class MuteButton extends Component {

  render() { 
  return <div className={this.props.muted ? styles.muteButtonOn : styles.muteButtonOff} onClick={this.props.logic}><h3>{this.props.text}</h3></div>
  }
}

export default MuteButton;