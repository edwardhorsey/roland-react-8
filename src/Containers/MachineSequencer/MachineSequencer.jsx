import React, { Component } from 'react';
import styles from './MachineSequencer.module.scss';
import ProgramSteps from '../../Components/ProgramSteps';


class MachineSequencer extends Component {

  render() { 

    const { storeStepRefs,
            currentSixteenth,
            updateLoop,
            clearLoop,
            loop,
            fillLoop } = this.props;

    return (
      <article className={styles.sequencer}>
        {['Clap', 'Hat', 'Open Hat', 'Cymbal', 'Hi Tom', 'Lo Tom', 'Kick'].map((sample, index) => {
          return <ProgramSteps
            key={index}
            storeStepRefs={storeStepRefs}
            currentSixteenth={currentSixteenth}
            title={sample}
            updateLoop={updateLoop}
            clearLoop={clearLoop}
            fillLoop={fillLoop}
            loop={loop[sample]}
          />
        })}
      </article>
    );
  }
}
 
export default MachineSequencer;