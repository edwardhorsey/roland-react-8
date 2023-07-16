import React, { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { setupSample } from "../engine/load-samples";
import {
    gainStage,
    setupGainNodes,
    createMasterGain,
    createLimiter,
    createMainDryOut,
    createDistortion,
    createDistortionPre,
    createDistortionOut,
} from "../engine/load-audio-nodes";

import MachineSequencer from "./MachineSequencer";
import MachineKnobs from "./MachineKnobs";
import { getObjectKeysUnsafe } from "~/lib/helpers";
import type { Track } from "~/types/tracks";
import type { Loop } from "~/types/loop";

interface Engine {
    gainNodes: Record<Track, GainNode> | undefined;
    masterGain: GainNode | undefined;
    mainDryOut: GainNode | undefined;
    distortion: WaveShaperNode | undefined;
    distortionPre: GainNode | undefined;
    distortionOut: GainNode | undefined;
    limiter: DynamicsCompressorNode | undefined;
    mainOut: string;
    stepRefs: { [K in Track]?: MutableRefObject<HTMLDivElement[] | null> };
    notesInQueue: { note: number; time: number }[];
    lastNoteDrawn: number;
    lookahead: number;
    scheduleAheadTime: number;
    timerID: number | undefined;
    shouldDraw: boolean;
    unlocked: boolean;
    tempo: number;
    current16thNote: number;
    nextNoteTime: number;
}

function App() {
    const engine = useRef<Engine>({
        gainNodes: undefined,
        mainDryOut: undefined,
        masterGain: undefined,
        distortion: undefined,
        distortionPre: undefined,
        distortionOut: undefined,
        limiter: undefined,
        mainOut: "",
        stepRefs: {},
        notesInQueue: [],
        lastNoteDrawn: 0,
        lookahead: 25.0,
        scheduleAheadTime: 0.2,
        timerID: undefined,
        shouldDraw: false,
        unlocked: false,
        tempo: 130,
        current16thNote: 0,
        nextNoteTime: 0.0,
    });

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

            const engineNodes = {
                gainNodes: setupGainNodes(context),
                mainDryOut: createMainDryOut(context),
                masterGain: createMasterGain(context),
                distortion: createDistortion(context),
                distortionPre: createDistortionPre(context),
                distortionOut: createDistortionOut(context),
                limiter: createLimiter(context),
            };

            engine.current = { ...engine.current, ...engineNodes };

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
        if (
            !state.context ||
            !engine.current ||
            !engine.current.distortionPre ||
            !engine.current.distortion ||
            !engine.current.distortionOut ||
            !engine.current.masterGain ||
            !engine.current.mainDryOut
        )
            return;

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
        if (!engine.current || !state.bufferLoader || !engine.current.gainNodes)
            return;

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
        const currentTime = state.context.currentTime;

        while (
            engine.current.notesInQueue.length &&
            engine.current.notesInQueue[0] &&
            engine.current.notesInQueue[0].time < currentTime
        ) {
            drawNote = engine.current.notesInQueue[0].note;
            engine.current.notesInQueue.splice(0, 1);

            if (engine.current.lastNoteDrawn !== drawNote) {
                for (const prop of getObjectKeysUnsafe(
                    engine.current.stepRefs
                )) {
                    const stepRef = engine.current.stepRefs[prop];
                    const lastNoteDrawn = engine.current.lastNoteDrawn;

                    if (stepRef && stepRef.current) {
                        const previous = stepRef.current[lastNoteDrawn];

                        if (previous) {
                            previous.style.backgroundColor = "";
                        }

                        const next = stepRef.current[drawNote];

                        if (next) {
                            next.style.backgroundColor =
                                "rgba(241, 241, 241, 0.3)";
                        }
                    }
                }

                engine.current.lastNoteDrawn = drawNote;
            }
        }

        if (engine.current.shouldDraw) requestAnimationFrame(draw);
    };

    const scheduler = () => {
        if (!engine.current || !state.context) return;

        while (
            engine.current.nextNoteTime <
            state.context.currentTime + engine.current.scheduleAheadTime
        ) {
            scheduleNote(
                engine.current.current16thNote,
                engine.current.nextNoteTime
            );
            nextNote();
        }
        engine.current.timerID = window.setTimeout(
            scheduler,
            engine.current.lookahead
        );
    };

    const start = async () => {
        if (!engine.current || !state.context) return;

        if (!engine.current.unlocked) {
            await state.context.resume();
            const buffer = state.context.createBuffer(1, 1, 22050);
            const node = state.context.createBufferSource();
            node.buffer = buffer;
            node.start(0);
            engine.current.unlocked = true;
        }

        engine.current.nextNoteTime = state.context.currentTime; // Important: takes time from when you start scheduling the sequencing
        scheduler();
        engine.current.shouldDraw = true;
        requestAnimationFrame(draw);
    };

    const stop = () => {
        if (!engine.current) return;

        window.clearTimeout(engine.current.timerID);
        engine.current.shouldDraw = false;
    };

    const reset = () => {
        if (!engine.current) return;

        window.clearTimeout(engine.current.timerID);
        engine.current.current16thNote = 0;
        engine.current.shouldDraw = false;

        setTimeout(() => {
            if (!engine.current?.stepRefs) return;

            for (const prop of getObjectKeysUnsafe(engine.current.stepRefs)) {
                const stepRef = engine.current.stepRefs?.[prop];

                if (stepRef && stepRef.current) {
                    stepRef.current.forEach((ref) => {
                        if (ref) ref.style.backgroundColor = "";
                    });
                }
            }
        }, 250);
    };

    const distortionOn = () => {
        if (
            !engine.current ||
            !engine.current.distortionOut ||
            !engine.current.mainDryOut
        )
            return;

        if (!state.distortionOn) {
            engine.current.distortionOut.gain.value = 0.7;
            engine.current.mainDryOut.gain.value = 0;
        } else {
            engine.current.distortionOut.gain.value = 0;
            engine.current.mainDryOut.gain.value = 1;
        }

        setState({ ...state, distortionOn: !state.distortionOn });
    };

    const updateLoop = (num: number, onOrOff: 0 | 1, instr: Track) => {
        const newSequence = state.loop;
        newSequence[instr][Number(num)] = onOrOff ? 1 : 0;
        setState({ ...state, loop: newSequence });
    };

    const clearLoop = (instr: Track) => {
        const newSequence = state.loop;
        newSequence[instr] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        setState({ ...state, loop: newSequence });
    };

    const fillLoop = (instr: Track) => {
        const newSequence = state.loop;
        newSequence[instr] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        setState({ ...state, loop: newSequence });
    };

    const loadLoop = (loop: Loop) => setState({ ...state, loop });

    const updateGain = (instr: Track, value: number) => {
        if (engine.current?.gainNodes) {
            const newValue = (gainStage[instr] * value) / 100;
            engine.current.gainNodes[instr].gain.value = newValue;
        }
    };

    const updateMaster = (value: number) => {
        if (engine.current?.masterGain)
            engine.current.masterGain.gain.value = value / 100;
    };

    const updateTempo = (newTempo: number) => {
        if (engine.current) engine.current.tempo = newTempo;
    };

    const storeStepRefs = (
        title: Track,
        array: MutableRefObject<HTMLDivElement[]>
    ) => {
        if (engine.current) {
            engine.current.stepRefs[title] = array;
        }
    };

    return (
        <div className="flex flex-col gap-5 bg-green-800 p-5">
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
