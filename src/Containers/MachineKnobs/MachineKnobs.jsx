import React, { Component } from 'react';
import styles from './MachineKnobs.module.scss';

import InstrumentControls from "../../Components/InstrumentControls";
import SampleControls from "../../Components/SampleControls";

class MachineKnobs extends Component {

  render() { 

    const {
      updateTempo,
      updateMaster,
      start,
      stop,
      reset,
      updateGain,
      distortionOn,
      distorted
    } = this.props

    console.log(this.props)

  return (
    <section className={styles.topSection}>
      <article className={styles.instrControls}>
        <InstrumentControls
          updateTempo={updateTempo}
          updateMaster={updateMaster}
          start={start}
          stop={stop}
          reset={reset}
          distortionOn={distortionOn}
          distorted={distorted}
        />
      </article>
      <article className={styles.sampleControls}>
        <SampleControls title={'Clap'} updateGain={updateGain} />
        <SampleControls title={'Hat'} updateGain={updateGain} />
        <SampleControls title={'Open Hat'} updateGain={updateGain} />
        <SampleControls title={'Cymbal'} updateGain={updateGain} />
        <SampleControls title={'Hi Tom'} updateGain={updateGain} />
        <SampleControls title={'Lo Tom'} updateGain={updateGain} />
        <SampleControls title={'Kick'} updateGain={updateGain} />
      </article>

    </section>
  );
  }
}
 
export default MachineKnobs;