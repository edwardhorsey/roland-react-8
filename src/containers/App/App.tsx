import React, { useEffect, useRef, useState } from "react";
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
import { getObjectKeysUnsafe } from "~/data/helpers";
import type { Track } from "~/data/tracks";

type Loop = Record<Track, number[]>;

interface Engine {
    gainNodes: Record<Track, GainNode>;
    masterGain: GainNode;
    mainDryOut: GainNode;
    distortion: WaveShaperNode;
    distortionPre: GainNode;
    distortionOut: GainNode;
    limiter: DynamicsCompressorNode;
    mainOut: string;
    stepRefs:
        | Record<Track, React.MutableRefObject<HTMLDivElement | null>[]>
        | undefined;
    notesInQueue: { note: number; time: number }[];
    lastNoteDrawn: string;
    lookahead: string;
    scheduleAheadTime: string;
    timerID: string;
    unlocked: string;
    tempo: number;
    current16thNote: number;
    nextNoteTime: number;
}

function App() {
    const engine = useRef<Engine | undefined>();

    const [state, setState] = useState<{
        context: AudioContext | undefined;
        bufferLoader: Record<string, AudioBuffer> | undefined;
        distortionOn: boolean;
        loop: Loop;
    }>({
        context: undefined, // audio context
        bufferLoader: undefined, // samples
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
    });

    useEffect(() => {
        const init = async () => {
            const context = new AudioContext();
            const buffers = await setupSample(context);

            setState((state) => ({
                ...state,
                context,
                bufferLoader: buffers,
            }));

            engine.current = {
                gainNodes: setupGainNodes(context),
                mainDryOut: createMainDryOut(context),
                masterGain: createMasterGain(context),
                distortion: createDistortion(context),
                distortionPre: createDistortionPre(context),
                distortionOut: createDistortionOut(context),
                limiter: createLimiter(context),
                mainOut: "",
                stepRefs: undefined,
                notesInQueue: [],
                lastNoteDrawn: 0,
                lookahead: 25.0,
                scheduleAheadTime: 0.2,
                timerID: "",
                unlocked: false,
                tempo: 130,
                current16thNote: 0,
                nextNoteTime: 0.0,
            };

            console.log("context and sounds loaded and stored on state");
        };

        init().catch((error) => console.log(error));
    }, []);

    const nextNote = () => {
        if (!engine.current) return;

        const secondsPerBeat = 60.0 / engine.current.tempo;
        engine.current.nextNoteTime =
            engine.current.nextNoteTime + 0.25 * secondsPerBeat;
        engine.current.current16thNote = engine.current.current16thNote + 1;

        if (engine.current.current16thNote === 16) {
            engine.current.current16thNote = 0;
        }
    };

    const playSample = (
        audioBuffer: AudioBuffer,
        instrNode: AudioNode,
        time: number
    ) => {
        if (!state.context || !engine.current) return;

        const sampleSource = state.context.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.connect(instrNode);
        instrNode.connect(engine.current.mainDryOut);

        if (state.distortionOn) {
            instrNode.connect(engine.current.distortionPre);
            engine.current.distortionPre.connect(engine.current.distortion);
            engine.current.distortion.connect(engine.current.distortionOut);
            engine.current.distortionOut.connect(engine.current.masterGain);
        }

        engine.current.mainDryOut.connect(engine.current.masterGain);
        engine.current.masterGain.connect(state.context.destination);
        sampleSource.start(time);

        return sampleSource;
    };

    const scheduleNote = (beatNumber: number, time: number) => {
        if (!engine.current || !state.bufferLoader) return;

        const { loop, bufferLoader } = state;
        engine.current.notesInQueue.push({ note: beatNumber, time: time });

        for (const prop of getObjectKeysUnsafe(loop)) {
            const buffer = bufferLoader[prop];

            if (loop[prop][engine.current.current16thNote] && buffer) {
                playSample(buffer, engine.current.gainNodes[prop], time);
            }
        }
    };

    const draw = () => {
        if (!engine.current || !state.context || !engine.current.stepRefs)
            return;

        let drawNote = engine.current.lastNoteDrawn;
        let currentTime = state.context.currentTime;

        while (
            engine.current.notesInQueue.length &&
            engine.current.notesInQueue[0].time < currentTime
        ) {
            drawNote = engine.current.notesInQueue[0].note;
            engine.current.notesInQueue.splice(0, 1);
        }

        if (engine.current.lastNoteDrawn !== drawNote) {
            for (const prop of engine.current.stepRefs) {
                const lastNoteDrawn = engine.current.lastNoteDrawn;

                engine.current.stepRefs[prop][
                    lastNoteDrawn
                ].current.style.backgroundColor = "";
                engine.current.stepRefs[prop][
                    drawNote
                ].current.style.backgroundColor = "rgba(241, 241, 241, 0.3)";
            }

            engine.current.lastNoteDrawn = drawNote;
        }

        requestAnimationFrame(this.draw);
    };

    const scheduler = () => {
        while (
            this.nextNoteTime <
            this.state.context.currentTime + this.scheduleAheadTime
        ) {
            this.scheduleNote(this.current16thNote, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = window.setTimeout(this.scheduler, this.lookahead);
    };

    const start = () => {
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

    const stop = () => window.clearTimeout(this.timerID);

    const reset = () => {
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

    const distortionOn = () => {
        if (!this.state.distortionOn) {
            this.distortionOut.gain.value = 0.7;
            this.mainDryOut.gain.value = 0;
        } else {
            this.distortionOut.gain.value = 0;
            this.mainDryOut.gain.value = 1;
        }
        this.setState({ distortionOn: !this.state.distortionOn });
    };

    const updateLoop = (num, state, instr) => {
        const newSequence = this.state.loop;
        newSequence[instr][Number(num)] = state ? 1 : 0;
        this.setState({ loop: newSequence });
    };

    const clearLoop = (instr) => {
        const newSequence = this.state.loop;
        newSequence[instr] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.setState({ loop: newSequence });
    };

    const fillLoop = (instr) => {
        const newSequence = this.state.loop;
        newSequence[instr] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        this.setState({ loop: newSequence });
    };

    const loadLoop = (loop) => this.setState({ loop });

    const updateGain = (instr, value) => {
        console.log(instr, value);
        if (this.gainNodes) {
            let newValue = (gainStage[instr] * value) / 100;
            this.gainNodes[instr].gain.value = newValue;
        }
    };

    const updateMaster = (value) => {
        if (this.masterGain) this.masterGain.gain.value = value / 100;
    };

    const updateTempo = (newTempo) => (this.tempo = newTempo);

    const storeStepRefs = (title, array) => (this.stepRefs[title] = array);

    return (
        <div className={`${styles.app ?? ""} gap-5 p-5`}>
            <MachineKnobs
                updateTempo={updateTempo}
                updateMaster={updateMaster}
                start={start}
                stop={stop}
                reset={reset}
                updateGain={updateGain}
                distortionOn={distortionOn}
                distorted={state.distortionOn}
                loop={state.loop}
                loadLoop={loadLoop}
            />
            <MachineSequencer
                updateLoop={updateLoop}
                clearLoop={clearLoop}
                fillLoop={fillLoop}
                loop={state.loop}
                storeStepRefs={storeStepRefs}
            />
        </div>
    );
}

export default App;
