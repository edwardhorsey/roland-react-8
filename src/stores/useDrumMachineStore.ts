import create from "zustand";
import { setupSample } from "~/engine/load-samples";
import {
    setupGainNodes,
    createMainDryOut,
    createMasterGain,
    createDistortion,
    createDistortionPre,
    createDistortionOut,
    createLimiter,
    gainStage,
} from "~/engine/load-audio-nodes";
import { getObjectKeysUnsafe } from "~/lib/helpers";
import type { Track } from "~/types/tracks";
import type { Loop } from "~/types/loop";
import type { MutableRefObject } from "react";

const sequencer: {
    notesInQueue: { note: number; time: number }[];
    lastNoteDrawn: number;
    lookahead: number;
    scheduleAheadTime: number;
    current16thNote: number;
    nextNoteTime: number;
    timerID: undefined | number;
} = {
    notesInQueue: [],
    lastNoteDrawn: 0,
    lookahead: 25.0,
    scheduleAheadTime: 0.2,
    current16thNote: 0,
    nextNoteTime: 0.0,
    timerID: undefined,
};

type GainNodes = {
    gainNodes: { [k in Track]?: GainNode } | undefined;
    mainDryOut: GainNode | undefined;
    masterGain: GainNode | undefined;
    distortion: WaveShaperNode | undefined;
    distortionPre: GainNode | undefined;
    distortionOut: GainNode | undefined;
    limiter: DynamicsCompressorNode | undefined;
};

export type DrumMachine = {
    stepRefs: { [k in Track]?: MutableRefObject<HTMLDivElement[]> } | undefined;
    unlocked: boolean;
    tempo: number;
    isPlaying: boolean;
    bufferLoader: { [k in Track]?: AudioBuffer } | undefined;
    context: AudioContext | undefined;
    distortionOn: boolean;
    loop: Loop;
    init: () => Promise<void>;
    nextNote: () => void;
    playSample: (
        audioBuffer: AudioBuffer,
        instrNode: AudioNode,
        time: number
    ) => AudioBufferSourceNode | undefined;
    scheduleNote: (beatNumber: number, time: number) => void;
    draw: () => void;
    scheduler: () => void;
    start: () => Promise<void>;
    stop: () => void;
    reset: () => void;
    toggleDistortion: () => void;
    updateLoop: (num: number, onOrOff: 0 | 1, instr: Track) => void;
    clearLoop: (instr: Track) => void;
    fillLoop: (instr: Track) => void;
    loadLoop: (loop: Loop) => void;
    updateGain: (instr: Track, value: number) => void;
    updateMaster: (value: number) => void;
    updateTempo: (newTempo: number) => void;
    storeStepRefs: (
        title: Track,
        array: MutableRefObject<HTMLDivElement[]>
    ) => void;
};

type DrumMachineStore = GainNodes & DrumMachine;

const useDrumMachineStore = create<DrumMachineStore>()((set, get) => ({
    gainNodes: undefined,
    mainDryOut: undefined,
    masterGain: undefined,
    distortion: undefined,
    distortionPre: undefined,
    distortionOut: undefined,
    limiter: undefined,

    stepRefs: {},
    unlocked: false,
    tempo: 130,
    isPlaying: false,

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

    init: async () => {
        const context = new AudioContext();
        const buffers = await setupSample(context);

        set((state) => ({
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

        set((state) => ({ ...state, ...engineNodes }));

        console.log("context and sounds loaded and stored on state");
    },

    nextNote: () => {
        const tempo = get().tempo;

        const secondsPerBeat = 60.0 / tempo;
        sequencer.nextNoteTime = sequencer.nextNoteTime + 0.25 * secondsPerBeat;
        sequencer.current16thNote = sequencer.current16thNote + 1;

        if (sequencer.current16thNote === 16) {
            sequencer.current16thNote = 0;
        }
    },

    playSample: (
        audioBuffer: AudioBuffer,
        instrNode: AudioNode,
        time: number
    ) => {
        const {
            context,
            distortionOn,
            distortionPre,
            distortion,
            distortionOut,
            masterGain,
            mainDryOut,
        } = get();

        if (
            !context ||
            !mainDryOut ||
            !distortionPre ||
            !distortion ||
            !distortionOut ||
            !masterGain ||
            !mainDryOut
        )
            return;

        const sampleSource = context.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.connect(instrNode);
        instrNode.connect(mainDryOut);

        if (distortionOn) {
            instrNode.connect(distortionPre);
            distortionPre.connect(distortion);
            distortion.connect(distortionOut);
            distortionOut.connect(masterGain);
        }

        mainDryOut.connect(masterGain);
        masterGain.connect(context.destination);
        sampleSource.start(time);

        return sampleSource;
    },

    scheduleNote: (beatNumber: number, time: number) => {
        const { bufferLoader, gainNodes, loop } = get();

        if (!bufferLoader || !gainNodes) return;

        sequencer.notesInQueue.push({ note: beatNumber, time: time });

        for (const prop of getObjectKeysUnsafe(loop)) {
            const buffer = bufferLoader[prop];

            if (loop[prop][sequencer.current16thNote] && buffer) {
                const audioNode = gainNodes[prop];

                if (audioNode) {
                    get().playSample(buffer, audioNode, time);
                }
            }
        }
    },

    draw: () => {
        const { context, stepRefs, isPlaying } = get();

        if (!context || !stepRefs) return;

        let drawNote = sequencer.lastNoteDrawn;
        const currentTime = context.currentTime;

        while (
            sequencer.notesInQueue.length &&
            sequencer.notesInQueue[0] &&
            sequencer.notesInQueue[0].time < currentTime
        ) {
            drawNote = sequencer.notesInQueue[0].note;
            sequencer.notesInQueue.splice(0, 1);

            if (sequencer.lastNoteDrawn !== drawNote) {
                for (const prop of getObjectKeysUnsafe(stepRefs)) {
                    const stepRef = stepRefs[prop];

                    if (stepRef && stepRef.current) {
                        const previous =
                            stepRef.current[sequencer.lastNoteDrawn];

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

                sequencer.lastNoteDrawn = drawNote;
            }
        }

        if (isPlaying) requestAnimationFrame(get().draw);
    },

    scheduler: () => {
        const { context, scheduleNote, nextNote, scheduler } = get();

        if (!context) return;

        while (
            sequencer.nextNoteTime <
            context.currentTime + sequencer.scheduleAheadTime
        ) {
            scheduleNote(sequencer.current16thNote, sequencer.nextNoteTime);
            nextNote();
        }

        sequencer.timerID = window.setTimeout(scheduler, sequencer.lookahead);
    },

    start: async () => {
        const { context, scheduler, draw } = get();

        if (!context) return;

        if (!get().unlocked) {
            await context.resume();
            const buffer = context.createBuffer(1, 1, 22050);
            const node = context.createBufferSource();
            node.buffer = buffer;
            node.start(0);
            set((state) => ({ ...state, unlocked: true }));
        }

        sequencer.nextNoteTime = context.currentTime; // Important: takes time from when you start scheduling the sequencing
        scheduler();

        set((state) => ({ ...state, isPlaying: true }));
        requestAnimationFrame(draw);
    },

    stop: () => {
        window.clearTimeout(sequencer.timerID);
        set((state) => ({ ...state, isPlaying: false }));
    },

    reset: () => {
        window.clearTimeout(sequencer.timerID);
        sequencer.current16thNote = 0;

        set((state) => ({ ...state, isPlaying: false }));

        setTimeout(() => {
            const { stepRefs } = get();

            if (!stepRefs) return;

            for (const prop of getObjectKeysUnsafe(stepRefs)) {
                const stepRef = stepRefs?.[prop];

                if (stepRef && stepRef.current) {
                    stepRef.current.forEach((ref) => {
                        if (ref) ref.style.backgroundColor = "";
                    });
                }
            }
        }, 250);
    },

    toggleDistortion: () => {
        const { distortionOn, distortionOut, mainDryOut } = get();

        if (!distortionOut || !mainDryOut) return;

        if (!distortionOn) {
            distortionOut.gain.value = 0.7;
            mainDryOut.gain.value = 0;
        } else {
            distortionOut.gain.value = 0;
            mainDryOut.gain.value = 1;
        }

        set((state) => ({ ...state, distortionOn: !state.distortionOn }));
    },

    updateLoop: (num: number, onOrOff: 0 | 1, instr: Track) => {
        const newSequence = get().loop;
        newSequence[instr][Number(num)] = onOrOff ? 1 : 0;
        set((state) => ({ ...state, loop: newSequence }));
    },

    clearLoop: (instr: Track) => {
        const newSequence = get().loop;
        newSequence[instr] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        set((state) => ({ ...state, loop: newSequence }));
    },

    fillLoop: (instr: Track) => {
        const newSequence = get().loop;
        newSequence[instr] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        set((state) => ({ ...state, loop: newSequence }));
    },

    loadLoop: (loop: Loop) => set((state) => ({ ...state, loop })),

    updateGain: (instr: Track, value: number) => {
        const { gainNodes } = get();

        if (!gainNodes) return;

        const audioNode = gainNodes[instr];

        if (!audioNode) return;

        const newValue = (gainStage[instr] * value) / 100;
        audioNode.gain.value = newValue;
    },

    updateMaster: (value: number) => {
        const { masterGain } = get();

        if (masterGain) masterGain.gain.value = value / 100;
    },

    updateTempo: (newTempo: number) => {
        set((state) => ({ ...state, tempo: newTempo }));
    },

    storeStepRefs: (
        title: Track,
        array: MutableRefObject<HTMLDivElement[]>
    ) => {
        set((state) => ({
            ...state,
            stepRefs: { ...state.stepRefs, [title]: array },
        }));
    },
}));

if (typeof window !== "undefined") {
    useDrumMachineStore
        .getState()
        .init()
        .catch((error) => console.log(error));
}

export default useDrumMachineStore;
