import React, { Component } from 'react';
import styles from './App.module.scss';
import Hosting from "./Components/Hosting";

import { AudioProvider } from "./context/audioEngine.js";
import { filenames } from "./data/filenames";
import { setupSample, setupGainNodes } from "./engine/load-samples/load-samples";
import MachineSequencer from './Containers/MachineSequencer';
import MachineKnobs from './Containers/MachineKnobs';

class App extends Component {
  
  state = {
    context: {}, // audio context
    bufferLoader: {}, // samples
    distortion: false,
    loop: {
      'Clap': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1 ],
      'Hat': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1 ],
      'Open Hat': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1 ],
      'Cymbal': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,1,0,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
      'Hi Tom': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,1, 0,0,1,0, 0,0,0,0, 0,1,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0 ],
      'Lo Tom': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,1, 0,0,1,0, 0,0,0,0, 0,1,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0 ],
      'Kick': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ], // [ 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ]
    }
  }
  
  gainNodes = ''
  masterGain = ''
  lookahead = 25.0
  scheduleAheadTime = 0.250
  timerID = ''
  unlocked = false
  tempo = 130
  current16thNote = 0
  nextNoteTime = 0.0
  
  async componentDidMount(){
    let context = new AudioContext();
    await setupSample(context, filenames)
    .then(buffers => {         
      this.setState({ context, bufferLoader: buffers })
      console.log('context and sounds loaded and stored on state');
    })
    .then(() => {
      this.gainNodes = setupGainNodes(this.state.context, filenames);       
      console.log('loaded gain nodes');
    })
    .then(() => {
      this.masterGain = this.state.context.createGain();
      console.log('loaded master gain');
    })
    .catch(err => console.log(err))
  }
  
  nextNote = () => {
    const secondsPerBeat = 60.0/this.tempo;
    this.nextNoteTime = this.nextNoteTime + 0.25 * secondsPerBeat;
    this.current16thNote = this.current16thNote + 1;
    if (this.current16thNote === 16) this.current16thNote = 0;
  };
  
  playSample(audioContext, audioBuffer, instrNode, masterGain, time) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(instrNode);
    instrNode.connect(masterGain);
    masterGain.connect(audioContext.destination);
    sampleSource.start(time);
    return sampleSource;
  }
  
  scheduleNote = (beatNumber, time) => {

    // const notesInQueue = [];  
    // console.log(time);
    // notesInQueue.push({  note: beatNumber, time: time  });
    
    console.log(this.current16thNote, beatNumber);  
    
    if (this.state.loop['Clap'][this.current16thNote]) this.playSample(this.state.context, this.state.bufferLoader['Clap'], this.gainNodes['Clap'], this.masterGain, time);
    if (this.state.loop['Hat'][this.current16thNote]) this.playSample(this.state.context, this.state.bufferLoader['Hat'], this.gainNodes['Hat'], this.masterGain, time);
    if (this.state.loop['Open Hat'][this.current16thNote]) this.playSample(this.state.context, this.state.bufferLoader['Open Hat'], this.gainNodes['Open Hat'], this.masterGain, time);
    if (this.state.loop['Cymbal'][this.current16thNote]) this.playSample(this.state.context, this.state.bufferLoader['Cymbal'], this.gainNodes['Cymbal'], this.masterGain, time);
    if (this.state.loop['Hi Tom'][this.current16thNote]) this.playSample(this.state.context, this.state.bufferLoader['Hi Tom'], this.gainNodes['Hi Tom'], this.masterGain, time);
    if (this.state.loop['Lo Tom'][this.current16thNote]) this.playSample(this.state.context, this.state.bufferLoader['Lo Tom'], this.gainNodes['Lo Tom'], this.masterGain, time);
    if (this.state.loop['Kick'][this.current16thNote]) this.playSample(this.state.context, this.state.bufferLoader['Kick'], this.gainNodes['Kick'], this.masterGain, time);
    
  }
  
  scheduler = () => {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (this.nextNoteTime < this.state.context.currentTime + this.scheduleAheadTime ) { 
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
    this.timerID =  window.setTimeout(this.scheduler, this.lookahead);
  }
  
  start = () => {
    if (!this.unlocked) {
      // play silent buffer to unlock the audio
      console.log(this.unlocked, this.state.context)
      var buffer = this.state.context.createBuffer(1, 1, 22050);
      var node = this.state.context.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      this.unlocked = true;
    }
    this.nextNoteTime = this.state.context.currentTime; // Important: takes time from when you start scheduling the sequencing
    this.scheduler();
  }
  
  stop = () => {
    window.clearTimeout(this.timerID);
  }
  
  updateLoop = (num, state, instr) => {
    let newSequence = this.state.loop;
    newSequence[instr][Number(num)] = state ? 1 : 0;
    this.setState({ loop: newSequence }); 
    console.log('updating', instr, 'with', newSequence);
  }

  clearLoop = (instr) => {
    let newSequence = this.state.loop;
    newSequence[instr] = [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ];
    this.setState({ loop: newSequence });
  }

  updateGain = (instr, value) => {
    if (this.gainNodes) { 
      this.gainNodes[instr].gain.value = value/100;
    }
  }

  updateMaster = (value) => {
    if (this.masterGain) { 
      this.masterGain.gain.value = value/100
    }
  }

  updateTempo = (newTempo) => {
    this.tempo = newTempo;
  }

  render() {

    console.log(this.state)

    return (
      <AudioProvider>
        <div className={styles.app}>
          <p>Roland-React-8</p>
          <MachineKnobs updateTempo={this.updateTempo} updateMaster={this.updateMaster} start={this.start} stop={this.stop} updateGain={this.updateGain} />
          <MachineSequencer updateLoop={this.updateLoop} clearLoop={this.clearLoop} loop={this.state.loop} />
          <Hosting />
        </div>
      </AudioProvider>
    );
  }
}

export default App;
