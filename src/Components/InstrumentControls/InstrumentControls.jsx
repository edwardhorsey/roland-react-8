import React, { Component } from 'react';
import styles from './InstrumentControls.module.scss';

class InstrumentControls extends Component {


  render() { 


    return (
      <section className={styles.instrControls}>
        <h3>Tempo</h3>
        <input type="range" min="30" max="240" value={this.props.tempo} class="slider" id="tempo" onChange={this.props.updateTempo} />
      </section>
     );
  }
}
 
export default InstrumentControls;