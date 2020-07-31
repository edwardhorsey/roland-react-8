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
          loop={this.props.loop}
          loadLoop={this.props.loadLoop}
        />
      </article>
      <article className={styles.sampleControls}>
        {['Clap', 'Hat', 'Open Hat', 'Cymbal', 'Hi Tom', 'Lo Tom', 'Kick'].map((sample, index) => {
          return <SampleControls key={index} title={sample} updateGain={updateGain} />
        })}
      </article>

    </section>
  );
  }
}
 
export default MachineKnobs;