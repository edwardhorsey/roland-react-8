import React, { Component } from 'react';
import styles from './Step.module.scss';


class Step extends Component {
  
  render() { 
    return <input type="checkbox" className={styles.step} name={this.props.step} onChange={this.props.logic} />;
  }
}
 
export default Step;