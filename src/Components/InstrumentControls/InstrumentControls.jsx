import React, { Component } from 'react';
import styles from './InstrumentControls.module.scss';
import { Donut } from 'react-dial-knob'
import Button from '../Button';
import FXButton from '../FXButton';


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
    this.props.updateMaster(master);
  }

  render() { 

    const { start, stop, distortionOn, distorted } = this.props;
    const { tempo, master } = this.state;

    return (
      <section className={styles.instrControls}>
        <h3>Instrument Controls</h3>
        <section clasName={styles.instrKnobs}>
        <Button text={'Start'} logic={start} />
          <Button text={'Stop'} logic={stop} />
          <Donut
            diameter={130}
            min={30}
            max={240}
            step={1}
            value={tempo}
            theme={{
                donutColor: 'Black'
            }}
            onValueChange={this.tempoChange}
            ariaLabelledBy={'my-label'}
          >
            <label id={'my-label'}>Tempo</label>
          </Donut>
          <Donut
            diameter={130}
            min={0}
            max={100}
            step={1}
            value={master}
            theme={{
                donutColor: 'Black'
            }}
            onValueChange={this.masterChange}
            ariaLabelledBy={'my-label'}
          >
            <label id={'my-label'}>Master Gain</label>
          </Donut>
          <FXButton text={'DISTORTION'} logic={distortionOn} dist={distorted} />
        </section>
        <div className={styles.aboutMe}>
          <p> <span role="img" aria-label="WIP">🚧</span> Work In Progress <span role="img" aria-label="WIP">🚧</span> </p>
          <p className={styles.italics}>made by Edward Horsey</p>
        </div>
      </section>
     );
  }
}
 
export default InstrumentControls;