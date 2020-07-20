import React, { Component } from 'react';
import styles from './Step.module.scss';


class Step extends Component {
  
  render() {
    const stepStyle = this.props.group ? styles.group : '';
    return <input type="checkbox" className={stepStyle} name={this.props.step} onChange={this.props.logic} />;
  }
}
 
export default Step; 