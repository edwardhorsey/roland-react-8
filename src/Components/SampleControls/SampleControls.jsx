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
          diameter={110}
          min={0}
          max={100}
          font-size={10}
          step={5}
          value={this.state.gain}
          theme={{
              donutColor: 'Black'
          }}
          onValueChange={this.valueChange}
          ariaLabelledBy={this.props.title}
        >
          <label id={this.props.title}>Gain</label>
        </Donut>
      </article>
     );
  }
}
 
export default SampleControls;