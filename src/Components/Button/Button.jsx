import React, { Component } from 'react';
import styles from './Button.module.scss';


class Button extends Component {

  render() { 
  return <button onClick={this.props.logic}>{this.props.text}</button>
  }
}
 
export default Button;