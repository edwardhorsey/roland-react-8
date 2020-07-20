import React, { Component } from 'react';
import styles from './Step.module.scss';


class Step extends Component {

  state = {
    selected: false,
  }

  sendToLoop = () => {
    this.props.logic(this.props.step, !this.state.selected)
    this.setState({ selected: !this.state.selected})
  }

  render() {
    // const stepStyle = this.props.group ? `${styles.step} ${styles.group}` : styles.step;
    const stepStyle = this.state.selected ? styles.on : styles.off;
    // return <input type="checkbox" className={stepStyle} name={this.props.step} onChange={this.props.logic} />;
    return <div className={stepStyle} name={this.props.step} onClick={this.sendToLoop}></div>;

  }
}
 
export default Step; 