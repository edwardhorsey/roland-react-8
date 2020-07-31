import React, { Component } from 'react';
import styles from './App.module.scss';
import { filenames } from "./data/filenames";
import { setupSample } from "./engine/load-samples";
import { 
  gainStage,
  setupGainNodes,
  createMasterGain,
  createLimiter,
  createMainDryOut,
  createDistortion,
  createDistortionPre,
  createDistortionOut
} from "./engine/load-audio-nodes";

import MachineSequencer from './Containers/MachineSequencer';
import MachineKnobs from './Containers/MachineKnobs';



class App extends Component {
  
  constructor(props) {
    super(props)
    this.gainNodes = '';
    this.masterGain = '';
    this.mainOut = '';
    this.stepRefs = {};
    this.notesInQueue = [];
    this.lastNoteDrawn = 0;
    this.lookahead = 25.0;
    this.scheduleAheadTime = 0.200;
    this.timerID = '';
    this.unlocked = false;
    this.tempo = 130;
    this.current16thNote = 0;
    this.nextNoteTime = 0.0;
  }

  state = {
    context: {}, // audio context
    bufferLoader: {}, // samples
    distortionOn: false,
    loop: {
      'Clap': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ],
      'Hat': [ 0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0,  ],
      'Open Hat': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ],
      'Cymbal': [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0  ],
      'Hi Tom': [ 0,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0  ],
      'Lo Tom': [ 0,1,0,1, 0,0,0,0, 0,1,0,1, 0,0,1,0  ],
      'Kick': [ 1,0,0,0, 1,0,0,1, 1,0,0,0, 1,0,0,0 ],
    },
    currentSixteenth: '',
  }
  
  async componentDidMount(){
    let context = new AudioContext();
    await setupSample(context, filenames)
    .then(buffers => {         
      this.setState({ context, bufferLoader: buffers })
      console.log('context and sounds loaded and stored on state');
    })
    .then(() => {
      this.gainNodes = setupGainNodes(this.state.context, filenames);
      this.mainDryOut = createMainDryOut(this.state.context);
      this.masterGain = createMasterGain(this.state.context);
    })
    .then(() => {
      this.distortion = createDistortion(this.state.context);
      this.distortionPre = createDistortionPre(this.state.context);
      this.distortionOut = createDistortionOut(this.state.context);
    })
    .then(()=>{
      this.limiter = createLimiter(this.state.context)
    })
    .catch(err => console.log(err))
  }
  
  nextNote = () => {
    const secondsPerBeat = 60.0/this.tempo;
    this.nextNoteTime = this.nextNoteTime + 0.25 * secondsPerBeat;
    this.current16thNote = this.current16thNote + 1;
    if (this.current16thNote === 16) this.current16thNote = 0;
  };
  
  playSample(audioBuffer, instrNode, time) {
    const sampleSource = this.state.context.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(instrNode);
    instrNode.connect(this.mainDryOut);
    if (this.state.distortionOn) {
      instrNode.connect(this.distortionPre);
      this.distortionPre.connect(this.distortion);
      this.distortion.connect(this.distortionOut);
      this.distortionOut.connect(this.masterGain);
    }
    this.mainDryOut.connect(this.masterGain);
    // this.masterGain.connect(this.limiter);
    this.masterGain.connect(this.state.context.destination);
    // this.limiter.connect(this.state.context.destination);
    sampleSource.start(time);
    return sampleSource;
  }
  
  scheduleNote = (beatNumber, time) => {
    const { loop, bufferLoader } = this.state;
    this.notesInQueue.push({  note: beatNumber, time: time  });
    console.log(this.current16thNote, beatNumber, this.notesInQueue);  
    for (let prop in loop) {
      if (loop[prop][this.current16thNote]) this.playSample(bufferLoader[prop], this.gainNodes[prop], time);
    }
  }

  draw = () => {
    let drawNote = this.lastNoteDrawn;
    let currentTime = this.state.context.currentTime;
    while (this.notesInQueue.length && this.notesInQueue[0].time < currentTime) {
        drawNote = this.notesInQueue[0].note;
        this.notesInQueue.splice(0,1);
    }
    if (this.lastNoteDrawn !== drawNote) {
      for (let prop in this.stepRefs) {
        this.stepRefs[prop][this.lastNoteDrawn].current.style.backgroundColor = ''; 
        this.stepRefs[prop][drawNote].current.style.backgroundColor = 'rgba(241, 241, 241, 0.3)';
      }
      this.lastNoteDrawn = drawNote;
    }
    requestAnimationFrame(this.draw);
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
      console.log(this.unlocked, this.state.context)
      var buffer = this.state.context.createBuffer(1, 1, 22050);
      var node = this.state.context.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      this.unlocked = true;
    }
    this.nextNoteTime = this.state.context.currentTime; // Important: takes time from when you start scheduling the sequencing
    this.scheduler();
    requestAnimationFrame(this.draw);
  }
  
  stop = () => {
    window.clearTimeout(this.timerID);
  }

  reset = () => {
    window.clearTimeout(this.timerID);
    this.current16thNote = 0;
    console.log('reset')
    setTimeout(
      ()=>{
        for (let prop in this.stepRefs){
          this.stepRefs[prop].forEach(ref => ref.current.style.backgroundColor = '')
        }
      }, 250
    )
  }

  distortionOn = () => {
    if (!this.state.distortionOn) {
      this.distortionOut.gain.value = 0.7;
      this.mainDryOut.gain.value = 0;
    } else {
      this.distortionOut.gain.value = 0;
      this.mainDryOut.gain.value = 1;
    }
    this.setState({ distortionOn: !this.state.distortionOn });
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
  
  fillLoop = (instr) => {
    let newSequence = this.state.loop;
    newSequence[instr] = [ 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1 ];
    this.setState({ loop: newSequence });
  }

  loadLoop = (loop) => {
    this.setState({ loop });
  }
  
  updateGain = (instr, value) => {
    if (this.gainNodes) { 
      let newValue = (gainStage[instr] * value) / 100;
      this.gainNodes[instr].gain.value = newValue;
    }
  }

  updateMaster = (value) => {
    if (this.masterGain) { 
      this.masterGain.gain.value = (value) / 100
    }
  }

  updateTempo = (newTempo) => {
    this.tempo = newTempo;
  }

  storeStepRefs = (title, array) => {
    this.stepRefs[title] = array;
  }

  render() {

    return (
        <div className={styles.app}>
          <MachineKnobs
            updateTempo={this.updateTempo}
            updateMaster={this.updateMaster}
            start={this.start}
            stop={this.stop}
            reset={this.reset}
            updateGain={this.updateGain}
            distortionOn={this.distortionOn}
            distorted={this.state.distortionOn}
            loop={this.state.loop}
            loadLoop={this.loadLoop}
          />
          <MachineSequencer
            updateLoop={this.updateLoop}
            clearLoop={this.clearLoop}
            fillLoop={this.fillLoop}
            loop={this.state.loop}
            storeStepRefs={this.storeStepRefs}
          />
        </div>
    );
  }
}

export default App;
