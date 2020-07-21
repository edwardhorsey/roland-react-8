import React, { Component } from 'react';
import styles from './MachineSequencer.module.scss';
import ProgramSteps from '../../Components/ProgramSteps';


class MachineSequencer extends Component {

  render() { 

    const { updateLoop, clearLoop, loop } = this.props

    return (
      <article className={styles.sequencer}>
        <ProgramSteps title={'Clap'} updateLoop={updateLoop} clearLoop={clearLoop} loop={loop['Clap']}/>
        <ProgramSteps title={'Hat'} updateLoop={updateLoop} clearLoop={clearLoop} loop={loop['Hat']}/>
        <ProgramSteps title={'Open Hat'} updateLoop={updateLoop} clearLoop={clearLoop} loop={loop['Open Hat']}/>
        <ProgramSteps title={'Cymbal'} updateLoop={updateLoop} clearLoop={clearLoop} loop={loop['Cymbal']}/>
        <ProgramSteps title={'Hi Tom'} updateLoop={updateLoop} clearLoop={clearLoop} loop={loop['Hi Tom']}/>
        <ProgramSteps title={'Lo Tom'} updateLoop={updateLoop} clearLoop={clearLoop} loop={loop['Lo Tom']}/>
        <ProgramSteps title={'Kick'} updateLoop={updateLoop} clearLoop={clearLoop} loop={loop['Kick']}/>
      </article>
    );
  }
}
 
export default MachineSequencer;