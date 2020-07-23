import React, { Component } from 'react';
import styles from './FXButton.module.scss';


class FXButton extends Component {

  render() { 
  return <div className={this.props.dist ? styles.FXButtonOn : styles.FXButtonOff} onClick={this.props.logic}><h2>{this.props.text}</h2></div>
  }
}

export default FXButton;