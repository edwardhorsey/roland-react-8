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
    const stepStyle = this.props.loop[this.props.step] ? styles.on : styles.off;
    const currentStepStyle = this.props.currentSixteenth === this.props.step ? styles.current : '';
    console.log(currentStepStyle)

    return (
    <div className={stepStyle} onClick={this.sendToLoop} name={this.props.step}>
      <div className={currentStepStyle} ></div>
    </div >);
  }
}
 
export default Step;