import React, { Component } from 'react';
import styles from './InstrumentControls.module.scss';
import { Donut } from 'react-dial-knob'


class InstrumentControls extends Component {

  state = {
    tempo: 120,
  }
  valueChange = tempo => {
    this.setState({ tempo });
    this.props.updateTempo(tempo);
  }


  render() { 


    return (
      <section className={styles.instrControls}>
        <h3>Tempo</h3>
        <Donut
          diameter={100}
          min={30}
          max={240}
          step={1}
          value={this.state.tempo}
          theme={{
              donutColor: 'Black'
          }}
          onValueChange={this.valueChange}
          ariaLabelledBy={'my-label'}
        >
          <label id={'my-label'}>Tempo</label>
        </Donut>

      </section>
     );
  }
}
 
export default InstrumentControls;