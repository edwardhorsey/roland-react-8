import React, { Component } from 'react';
import styles from './SampleControls.module.scss';
import { Donut } from 'react-dial-knob';
import MuteButton from '../MuteButton';


class SampleControls extends Component {

  state = {
    gain: 70,
    mute: false,
  }

  valueChange = gain => {
    this.setState({ gain: gain })
    this.props.updateGain(this.props.title, this.state.mute ? 0 : gain)
  }

  mute = () => {
    if (!this.state.mute) {
      this.props.updateGain(this.props.title, 0);
    } else {
      this.props.updateGain(this.props.title, this.state.gain);
    }
    this.setState({ mute: !this.state.mute });
  }

  render() { 

    return (
      <article className={styles.sampleKnobs}>
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
        {/* <Donut
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
          <label id={this.props.title}>Decay</label>
        </Donut> */}
        <MuteButton text={this.props.title} logic={this.mute} muted={this.state.mute} />
      </article>
     );
  }
}
 
export default SampleControls;