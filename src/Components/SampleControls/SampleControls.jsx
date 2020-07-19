import React, { Component } from 'react';
import styles from './SampleControls.module.scss';
import { Donut } from 'react-dial-knob'

class SampleControls extends Component {

  state = {
    gain: 90,
  }

  valueChange = gain => {
    this.setState({ gain: gain })
    this.props.updateGain(this.props.title, gain)
  }

  // componentDidMount() {

  // }

  render() { 

    return (
      <article className={styles.sampleKnobs}>
        <h2>{this.props.title}</h2>
        <p>Knobs</p>
        <Donut
          diameter={100}
          min={0}
          max={100}
          step={5}
          value={this.state.gain}
          theme={{
              donutColor: 'Black'
          }}
          onValueChange={this.valueChange}
          ariaLabelledBy={'my-label'}
        >
          <label id={'my-label'}>Gain</label>
        </Donut>
      </article>
     );
  }
}
 
export default SampleControls;