import React, { Component } from 'react';
import Step from './Step';
import styles from './ProgramSteps.module.scss';

class ProgramSteps extends Component {

  state = {
  }

  componentDidMount() {
  }

  renderSteps = (num) => {
    let output = [];
    for (let i=0; i<num; i++) {
      output.push(<Step step={i} key={i} logic={this.updateLoop} group={(i+1)%4===0 ? true : false} />)
    }
    return output;
  }

  updateLoop = (num, state) => {
    console.log(num, state)
    this.props.updateLoop(num, state, this.props.title);
  }

  render() { 

    const steps =  this.renderSteps(16)

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