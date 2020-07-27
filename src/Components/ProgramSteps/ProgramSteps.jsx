import React, { Component } from 'react';
import Step from '../Step';
import styles from './ProgramSteps.module.scss';
import Button from '../Button';

class ProgramSteps extends Component {
  constructor(props) {
    super(props);
    this.stepRefs = (()=>{
      let array=[];
      for (let i=0;i<16;i++) {
        array.push(React.createRef())
      }
      return array;
    })()
  }

  componentDidMount() {
    this.props.storeStepRefs(this.props.title, this.stepRefs)
  }

  renderSteps = (num) => {
    let output = [];
    for (let i=0; i<num; i++) {
      output.push(<Step ref={this.stepRefs[i]} handleClick={this.handleClick} step={i} key={i} currentSixteenth={this.props.currentSixteenth} logic={this.updateLoop} loop={this.props.loop} group={(i+1)%4===0 ? true : false} />)
    }

    return output;
  }

  updateLoop = (num, state) => {
    console.log(num, state)
    this.props.updateLoop(num, state, this.props.title);
  }

  render() { 
    let steps =  this.renderSteps(16)

    return (
      <article className={styles.instrument}>
        <h2>{this.props.title}</h2>
        <section>
          {steps}
        </section>
        <Button text="Clear" logic={() => {this.props.clearLoop(this.props.title)}} />
        <Button text="Fill" logic={() => {this.props.fillLoop(this.props.title)}} />

      </article>
     );
  }
}
 
export default ProgramSteps;