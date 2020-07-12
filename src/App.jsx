import React, { Component } from 'react';
import './App.css';
// import { context, bufferLoader, setupSample } from './engine/audio-context/audio-context'

import clap from './data/sounds/wa_808tape_clap_01_sat.wav';
import hat from './data/sounds/wa_808tape_closedhat_09_sat.wav';
import crash from './data/sounds/wa_808tape_crash_02_sat.wav';
import hitom from './data/sounds/wa_808tape_hitom_01_sat.wav';
import kick from './data/sounds/wa_808tape_kick_09_sat.wav';

let filenames = [ clap, hat, crash, hitom, kick ];



// import { AudioBufferSource } from "./engine/use-audio-hooks/AudioBufferSource";



export let context; // the Audio Context
export let bufferLoader; // our loaded samples will live here
export let unlocked = false;


async function getFile(audioContext, filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

async function setupSample(files) {
  let array = [];
  for (let i=0; i<filenames.length; i++){
    const sample = await getFile(context, filenames[i]);
    array.push(sample);
    }
  return array;
}

// window.addEventListener(
//   'load',
//   setupSample()
//     .then(buffers => {
//       bufferLoader = buffers;
//       console.log('loaded sounds');
//     }),
//   false
// );






class App extends Component {

  async componentDidMount(){

    context = new AudioContext();
    await setupSample(filenames)
    .then(buffers => {
      bufferLoader = buffers;
      console.log('loaded sounds');
    })
  }

 
  render() {


    return (
      <div className="App">
        {/* <AudioContext> */}
          <p>hi</p>
        {/* </AudioContext> */}


      </div>
    );
  }
}

export default App;
