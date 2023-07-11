import React, { Component } from "react";
import styles from "./App.module.scss";
import { setupSample } from "../../engine/load-samples";
import {
    gainStage,
    setupGainNodes,
    createMasterGain,
    createLimiter,
    createMainDryOut,
    createDistortion,
    createDistortionPre,
    createDistortionOut,
} from "../../engine/load-audio-nodes";

import MachineSequencer from "../MachineSequencer";
import MachineKnobs from "../MachineKnobs";

class App extends Component {
    gainNodes: null | any;
    masterGain: "";
    mainOut;
    stepRefs;
    notesInQueue;
    lastNoteDrawn;
    lookahead;
    scheduleAheadTime;
    timerID;
    unlocked;
    tempo;
    current16thNote;
    nextNoteTime;

    constructor(props) {
        super(props);
        this.gainNodes = null;
        this.masterGain = "";
        this.mainOut = "";
        this.stepRefs = {};
        this.notesInQueue = [];
        this.lastNoteDrawn = 0;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.2;
        this.timerID = "";
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
            clap: [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            hat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            openHat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cymbal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            hiTom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            loTom: [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
            kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        },
        currentSixteenth: "",
    };

    async componentDidMount() {
        try {
            const context = new AudioContext();

            const buffers = await setupSample(context);
            this.setState({ context, bufferLoader: buffers });
            console.log("context and sounds loaded and stored on state");

            this.gainNodes = setupGainNodes(context);
            this.mainDryOut = createMainDryOut(context);
            this.masterGain = createMasterGain(context);

            this.distortion = createDistortion(context);
            this.distortionPre = createDistortionPre(context);
            this.distortionOut = createDistortionOut(context);

            this.limiter = createLimiter(context);
        } catch (error) {
            console.log(error);
        }
    }

    nextNote = () => {
        const secondsPerBeat = 60.0 / this.tempo;
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
        this.masterGain.connect(this.state.context.destination);
        sampleSource.start(time);
        return sampleSource;
    }

    scheduleNote = (beatNumber, time) => {
        const { loop, bufferLoader } = this.state;
        this.notesInQueue.push({ note: beatNumber, time: time });
        for (let prop in loop) {
            if (loop[prop][this.current16thNote])
                this.playSample(bufferLoader[prop], this.gainNodes[prop], time);
        }
    };

    draw = () => {
        let drawNote = this.lastNoteDrawn;
        let currentTime = this.state.context.currentTime;
        while (
            this.notesInQueue.length &&
            this.notesInQueue[0].time < currentTime
        ) {
            drawNote = this.notesInQueue[0].note;
            this.notesInQueue.splice(0, 1);
        }
        if (this.lastNoteDrawn !== drawNote) {
            for (const prop in this.stepRefs) {
                this.stepRefs[prop][
                    this.lastNoteDrawn
                ].current.style.backgroundColor = "";
                this.stepRefs[prop][drawNote].current.style.backgroundColor =
                    "rgba(241, 241, 241, 0.3)";
            }
            this.lastNoteDrawn = drawNote;
        }
        requestAnimationFrame(this.draw);
    };

    scheduler = () => {
        while (
            this.nextNoteTime <
            this.state.context.currentTime + this.scheduleAheadTime
        ) {
            this.scheduleNote(this.current16thNote, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = window.setTimeout(this.scheduler, this.lookahead);
    };

    start = () => {
        if (!this.unlocked) {
            this.state.context.resume();
            var buffer = this.state.context.createBuffer(1, 1, 22050);
            var node = this.state.context.createBufferSource();
            node.buffer = buffer;
            node.start(0);
            this.unlocked = true;
        }
        this.nextNoteTime = this.state.context.currentTime; // Important: takes time from when you start scheduling the sequencing
        this.scheduler();
        requestAnimationFrame(this.draw);
    };

    stop = () => window.clearTimeout(this.timerID);

    reset = () => {
        window.clearTimeout(this.timerID);
        this.current16thNote = 0;
        setTimeout(() => {
            for (const prop in this.stepRefs) {
                this.stepRefs[prop].forEach(
                    (ref) => (ref.current.style.backgroundColor = "")
                );
            }
        }, 250);
    };

    distortionOn = () => {
        if (!this.state.distortionOn) {
            this.distortionOut.gain.value = 0.7;
            this.mainDryOut.gain.value = 0;
        } else {
            this.distortionOut.gain.value = 0;
            this.mainDryOut.gain.value = 1;
        }
        this.setState({ distortionOn: !this.state.distortionOn });
    };

    updateLoop = (num, state, instr) => {
        const newSequence = this.state.loop;
        newSequence[instr][Number(num)] = state ? 1 : 0;
        this.setState({ loop: newSequence });
    };

    clearLoop = (instr) => {
        const newSequence = this.state.loop;
        newSequence[instr] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.setState({ loop: newSequence });
    };

    fillLoop = (instr) => {
        const newSequence = this.state.loop;
        newSequence[instr] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        this.setState({ loop: newSequence });
    };

    loadLoop = (loop) => this.setState({ loop });

    updateGain = (instr, value) => {
        console.log(instr, value);
        if (this.gainNodes) {
            let newValue = (gainStage[instr] * value) / 100;
            this.gainNodes[instr].gain.value = newValue;
        }
    };

    updateMaster = (value) => {
        if (this.masterGain) this.masterGain.gain.value = value / 100;
    };

    updateTempo = (newTempo) => (this.tempo = newTempo);

    storeStepRefs = (title, array) => (this.stepRefs[title] = array);

    render() {
        return (
            <div className={`${styles.app ?? ""} gap-5 p-5`}>
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
