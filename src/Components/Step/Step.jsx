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

    return (
    <div className={stepStyle} onClick={this.sendToLoop} name={this.props.step}>
      <div ref={this.props.forwardRef} className={styles.inner} ></div>
    </div >);
  }
}
 
export default React.forwardRef((props, ref) => <Step {...props} forwardRef={ref} />)