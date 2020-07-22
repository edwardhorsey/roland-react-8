import React, { Component } from 'react';
import styles from './App.module.scss';
import Hosting from "./Components/Hosting";

import { AudioProvider } from "./context/audioEngine.js";

import { filenames } from "./data/filenames";
import setupSample from "./engine/load-samples/load-samples";
import MachineSequencer from './Containers/MachineSequencer';
import MachineKnobs from './Containers/MachineKnobs';


let context; // the Audio Context
let bufferLoader; // our loaded samples will live here
let masterGain; // whole drum machine
let gainNodes; // our gain nodes will live here
let lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.250; // How far ahead to schedule audio (sec)
let timerID;
let unlocked = false;


function setupGainNodes(context, files) {
  let obj = {};
  for (let prop in files) {
    const gain = context.createGain();
    obj[prop] = gain;
  }
  return obj;
}


function playSample(audioContext, audioBuffer, instrNode, time) {
  const sampleSource = audioContext.createBufferSource();
  sampleSource.buffer = audioBuffer;
  sampleSource.connect(instrNode);
  instrNode.connect(masterGain);
  masterGain.connect(audioContext.destination);
  sampleSource.start(time);
  return sampleSource;
}

let loop = {};

loop = {
  'Clap': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1 ],
  'Hat': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1 ],
  'Open Hat': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1 ],
  'Cymbal': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,1,0,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  'Hi Tom': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,1, 0,0,1,0, 0,0,0,0, 0,1,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0 ],
  'Lo Tom': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,1, 0,0,1,0, 0,0,0,0, 0,1,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0 ],
  'Kick': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ], // [ 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ]
}


// Playing notes in a sequence by loading a queue ahead of time.

let tempo; // BPM (beats per minute)
let current16thNote = 0;
let nextNoteTime = 0.0; // when the next note is due.

const nextNote = () => {
  const secondsPerBeat = 60.0/tempo;
  nextNoteTime += 0.25 * secondsPerBeat;
  current16thNote++;
  if (current16thNote === 16) current16thNote = 0;
};

// const notesInQueue = [];

const scheduleNote = (beatNumber, time) => {

  // console.log(time);
  // notesInQueue.push({  note: beatNumber, time: time  });

  console.log(current16thNote, beatNumber);  

  if (loop['Clap'][current16thNote]) playSample(context, bufferLoader['Clap'], gainNodes['Clap'], time);
  if (loop['Hat'][current16thNote]) playSample(context, bufferLoader['Hat'], gainNodes['Hat'], time);
  if (loop['Open Hat'][current16thNote]) playSample(context, bufferLoader['Open Hat'], gainNodes['Open Hat'], time);
  if (loop['Cymbal'][current16thNote]) playSample(context, bufferLoader['Cymbal'], gainNodes['Cymbal'], time);
  if (loop['Hi Tom'][current16thNote]) playSample(context, bufferLoader['Hi Tom'], gainNodes['Hi Tom'], time);
  if (loop['Lo Tom'][current16thNote]) playSample(context, bufferLoader['Lo Tom'], gainNodes['Lo Tom'], time);
  if (loop['Kick'][current16thNote]) playSample(context, bufferLoader['Kick'], gainNodes['Kick'], time);

}

const scheduler = () => {
  // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
  while (nextNoteTime < context.currentTime + scheduleAheadTime ) { 
      scheduleNote(current16thNote, nextNoteTime);
      nextNote();
  }
  timerID = window.setTimeout(scheduler, lookahead);
}

class App extends Component {

  state = {
    distortion: false,
  }

  async componentDidMount(){
    context = new AudioContext();
    await setupSample(context, filenames)
    .then(buffers => {
      bufferLoader = buffers;
      console.log('loaded sounds');
      console.log(bufferLoader);
    })
    .then(() => {
      gainNodes = setupGainNodes(context, filenames);
      console.log('loaded gain nodes');
      console.log(gainNodes);
    })
    .then(() => {
      masterGain = context.createGain();
      console.log('loaded master gain');
      console.log(masterGain);
    })
    .catch(err => console.log(err))
  }

  start = () => {
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = context.createBuffer(1, 1, 22050);
      var node = context.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }
    nextNoteTime = context.currentTime; // Important: takes time from when you start scheduling the sequencing
    scheduler();
  }

  stop = () => {
    window.clearTimeout(timerID);
  }

  updateLoop = (num, state, instr) => {
    let newSequence = loop[instr];
    newSequence[Number(num)] = state ? 1 : 0;
    loop[instr] = newSequence;
    console.log('updating', instr, 'with', newSequence);
  }

  clearLoop = (instr) => {
    loop[instr] = [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ];
  }

  updateGain = (instr, value) => {
    if (gainNodes) { 
      gainNodes[instr].gain.value = value/100 
      console.log(value/100, value, gainNodes[instr])
    }
    console.log(instr)
  }

  updateMaster = (value) => {
    if (masterGain) { masterGain.gain.value = value/100  }
  }

  updateTempo = (newTempo) => {
    tempo = newTempo;
  }

  render() {

    console.log(this.state)

    return (
      <AudioProvider>
        <div className={styles.app}>
          <p>Roland-React-8</p>
          
          <MachineKnobs updateTempo={this.updateTempo} updateMaster={this.updateMaster} start={this.start} stop={this.stop} updateGain={this.updateGain} />
          
          <MachineSequencer updateLoop={this.updateLoop} clearLoop={this.clearLoop} loop={loop} />
          
          <Hosting />
        </div>
      </AudioProvider>
    );
  }
}

export default App;
