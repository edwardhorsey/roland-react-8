import React, { Component } from 'react';
import Step from './Step';
import styles from './ProgramSteps.module.scss';

class ProgramSteps extends Component {

  state = {
    sequence: [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  }

  componentDidMount() {
    setTimeout(this.func, 3000)
  }

  func = () => {
    // this.props.updateSettings('Clap', 'Gain', 0.8)
    // this.props.updateSettings('Cymbal', 'Gain', 0.2)
    // this.props.updateSettings('Kick', 'Gain', 0.5)
  }

  renderSteps = (num) => {
    let output = [];
    for (let i=0; i<num; i++) {
      output.push(<Step step={i} key={i} logic={this.activateNote} />)
    }
    return output;
  }

  activateNote = (event) => {
    let newArray = this.state.sequence;
    newArray[Number(event.target.name)] = event.target.checked ? 1 : 0
    this.setState({ sequence: newArray });
    return this.props.updateLoop(this.props.title, newArray);
  }

  render() { 

    const steps =  this.renderSteps(16)
    const stepClass = this.props

    return (
      <article className={styles.instrument}>
        <h2>{this.props.title}</h2>
        <section>
          {steps}
        </section>
      </article>
     );
  }
}
 
export default ProgramSteps;