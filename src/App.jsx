import React, { Component } from 'react';
import styles from './App.module.scss';
import ProgramSteps from "./Components/ProgramSteps";
import Button from "./Components/Button";
import InstrumentControls from "./Components/InstrumentControls";
import Hosting from "./Components/Hosting";

import { filenames } from "./data/filenames";
import SampleControls from './Components/SampleControls';

let context; // the Audio Context
let bufferLoader; // our loaded samples will live here
let gainNodes; // our gain nodes will live here
// let pitchNodes; // our pitch effects will live here
let lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.250; // How far ahead to schedule audio (sec)
let timerID;
let unlocked = false;


async function getFile(audioContext, filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

async function setupSample(files) {
    let obj = {};
    for (let prop in files) {
      const sample = await getFile(context, files[prop])
      obj[prop] = sample
    }
  return obj;
}

function setupGainNodes(files) {
  let obj = {};
  for (let prop in files) {
    const gain = context.createGain();
    obj[prop] = gain;
  }
  return obj;
}

function playSample(audioContext, audioBuffer, gainNode, time) {
  const sampleSource = audioContext.createBufferSource();
  sampleSource.buffer = audioBuffer;
  sampleSource.connect(gainNode)
  gainNode.connect(audioContext.destination)
  sampleSource.start(time);
  return sampleSource;
}

let loop = {};

loop = {
  'Clap': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1 ],
  'Hat': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1 ],
  'Cymbal': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,1,0,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  'Hi Tom': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 0,0,0,1, 0,0,1,0, 0,0,0,0, 0,1,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0 ],
  'Kick': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ], // [ 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ]
}


// Playing notes in a sequence by loading a queue ahead of time.

let tempo = 110; // BPM (beats per minute)
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
  if (loop['Cymbal'][current16thNote]) playSample(context, bufferLoader['Cymbal'], gainNodes['Cymbal'], time);
  if (loop['Hi Tom'][current16thNote]) playSample(context, bufferLoader['Hi Tom'], gainNodes['Hi Tom'], time);
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
    'Clap': {},
    'Hat': {},
    'Cymbal': {},
    'Hi Tom': {},
    'Kick': {},
  }

  async componentDidMount(){
    context = new AudioContext();
    await setupSample(filenames)
    .then(buffers => {
      bufferLoader = buffers;
      console.log('loaded sounds');
      console.log(bufferLoader);
    })
    .then(() => {
      gainNodes = setupGainNodes(filenames);
      console.log('loaded gain nodes');
      console.log(gainNodes);
      this.setState({ gain: 90 })
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

  updateLoop = (instr, array) => {
    console.log('updating', instr, 'with', array)
    loop[instr] = array;
  }

  updateGain = (instr, value) => {
    if (gainNodes) { gainNodes[instr].gain.value = value/100 }
  }

  updateTempo = (newTempo) => {
    tempo = newTempo;
  }

  render() {

    return (
      <div className={styles.app}>
          <p>Roland-React-8</p>
          <InstrumentControls tempo={tempo} updateTempo={this.updateTempo} />

          <article className={styles.sampleControls}>
            <SampleControls title={'Clap'} updateGain={this.updateGain} />
            <SampleControls title={'Hat'} updateGain={this.updateGain} />
            <SampleControls title={'Cymbal'} updateGain={this.updateGain} />
            <SampleControls title={'Hi Tom'} updateGain={this.updateGain} />
            <SampleControls title={'Kick'} updateGain={this.updateGain} />
          </article>

          <article className={styles.sequencer}>
            <ProgramSteps title={'Clap'} updateLoop={this.updateLoop} />
            <ProgramSteps title={'Hat'} updateLoop={this.updateLoop} />
            <ProgramSteps title={'Cymbal'} updateLoop={this.updateLoop} />
            <ProgramSteps title={'Hi Tom'} updateLoop={this.updateLoop} />
            <ProgramSteps title={'Kick'} updateLoop={this.updateLoop} />
          </article>

          <Button text={'Start'} logic={this.start} />
          <Button text={'Stop'} logic={this.stop} />

          <Hosting />
      </div>
    );
  }
}

export default App;
