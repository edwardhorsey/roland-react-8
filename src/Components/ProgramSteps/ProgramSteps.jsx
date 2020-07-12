import React, { Component } from 'react';
import Step from './Step';
import styles from './ProgramSteps.module.scss';

class ProgramSteps extends Component {

  renderSteps = (num) => {
    let output = [];
    for (let i=0; i<num; i++) {
      output.push(<Step key={i}/>)
    }
    console.log(output);
    return output;
  }

  render() { 

    const steps =  this.renderSteps(16)
console.log('hi')
    console.log(steps);


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