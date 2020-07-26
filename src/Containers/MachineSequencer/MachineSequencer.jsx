import React, { Component } from 'react';
import styles from './MachineSequencer.module.scss';
import ProgramSteps from '../../Components/ProgramSteps';


class MachineSequencer extends Component {

  render() { 

    const { storeStepRefs, currentSixteenth, updateLoop, clearLoop, loop, fillLoop } = this.props

    return (
      <article className={styles.sequencer}>
        <ProgramSteps storeStepRefs={storeStepRefs} currentSixteenth={currentSixteenth} title={'Clap'} updateLoop={updateLoop} clearLoop={clearLoop} fillLoop={fillLoop} loop={loop['Clap']}/>
        <ProgramSteps storeStepRefs={storeStepRefs} currentSixteenth={currentSixteenth} title={'Hat'} updateLoop={updateLoop} clearLoop={clearLoop} fillLoop={fillLoop} loop={loop['Hat']}/>
        <ProgramSteps storeStepRefs={storeStepRefs} currentSixteenth={currentSixteenth} title={'Open Hat'} updateLoop={updateLoop} clearLoop={clearLoop} fillLoop={fillLoop} loop={loop['Open Hat']}/>
        <ProgramSteps storeStepRefs={storeStepRefs} currentSixteenth={currentSixteenth} title={'Cymbal'} updateLoop={updateLoop} clearLoop={clearLoop} fillLoop={fillLoop} loop={loop['Cymbal']}/>
        <ProgramSteps storeStepRefs={storeStepRefs} currentSixteenth={currentSixteenth} title={'Hi Tom'} updateLoop={updateLoop} clearLoop={clearLoop} fillLoop={fillLoop} loop={loop['Hi Tom']}/>
        <ProgramSteps storeStepRefs={storeStepRefs} currentSixteenth={currentSixteenth} title={'Lo Tom'} updateLoop={updateLoop} clearLoop={clearLoop} fillLoop={fillLoop} loop={loop['Lo Tom']}/>
        <ProgramSteps storeStepRefs={storeStepRefs} currentSixteenth={currentSixteenth} title={'Kick'} updateLoop={updateLoop} clearLoop={clearLoop} fillLoop={fillLoop} loop={loop['Kick']}/>
      </article>
    );
  }
}
 
export default MachineSequencer;