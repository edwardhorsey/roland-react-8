import React, { Component } from 'react';
import styles from './Button.module.scss';


class Button extends Component {

  render() { 
  return <div className={styles.button} onClick={this.props.logic}>{this.props.text}</div>
  }
}
 
export default Button;