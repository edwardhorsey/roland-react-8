import React, { Component } from 'react';
import Step from './Step';
import styles from './ProgramSteps.module.scss';

class ProgramSteps extends Component {

  state = {
    sequence: [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  }

  componentDidMount() {
  }

  renderSteps = (num) => {
    let output = [];
    for (let i=0; i<num; i++) {
      output.push(<Step step={i} key={i} logic={this.activateNote} group={(i+1)%4===0 ? true : false} />)
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
    // const stepClass = this.props

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