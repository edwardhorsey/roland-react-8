import React, { Component } from 'react';
import styles from './InstrumentControls.module.scss';
import { Donut } from 'react-dial-knob'
import Button from '../Button';


class InstrumentControls extends Component {

  state = {
    tempo: 130,
    master: 80,
    distortion: false,
  }

  tempoChange = tempo => {
    this.setState({ tempo });
    this.props.updateTempo(tempo);
  }

  masterChange = master => {
    this.setState({ master });
    this.props.updateGain(master);
  }

  toggleDistortion = () => {
    this.props.distToggle(!this.state.distortion);
    this.setState({ distortion: !this.state.distortion })
  }

  distortionStyle = () => {
    return this.state.distortion ? styles.distOn : styles.distOff;
  }


  render() { 


    return (
      <section className={styles.instrControls}>
        <h3>Instrument Controls</h3>
        <section clasName={styles.instrKnobs}>
          <Donut
            diameter={140}
            min={30}
            max={240}
            step={1}
            value={this.state.tempo}
            theme={{
                donutColor: 'Black'
            }}
            onValueChange={this.tempoChange}
            ariaLabelledBy={'my-label'}
          >
            <label id={'my-label'}>Tempo</label>
          </Donut>
          <Donut
            diameter={120}
            min={0}
            max={100}
            step={1}
            value={this.state.master}
            theme={{
                donutColor: 'Black'
            }}
            onValueChange={this.masterChange}
            ariaLabelledBy={'my-label'}
          >
            <label id={'my-label'}>Master Gain</label>
          </Donut>
          <Button text={'DISTORTION'} logic={this.toggleDistortion} className={styles.distOn}/>
        </section>

      </section>
     );
  }
}
 
export default InstrumentControls;