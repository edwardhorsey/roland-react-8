import create from "zustand";
import { setupSample } from "~/engine/load-samples";
import { gainStage, setupEngineNodes } from "~/engine/load-audio-nodes";
import { getObjectKeysUnsafe } from "~/lib/helpers";
import type { Track } from "~/types/tracks";
import type { Loop } from "~/types/loop";
import type { MutableRefObject } from "react";

type SequencerVars = {
    notesInQueue: { note: number; time: number }[];
    lastNoteDrawn: number;
    lookahead: number;
    scheduleAheadTime: number;
    current16thNote: number;
    nextNoteTime: number;
    timerID: undefined | number;
};

const sequencer: SequencerVars = {
    notesInQueue: [],
    lastNoteDrawn: 0,
    lookahead: 25.0,
    scheduleAheadTime: 0.2,
    current16thNote: 0,
    nextNoteTime: 0.0,
    timerID: undefined,
};

type EngineNodes = {
    gainNodes: { [k in Track]?: GainNode };
    mainDryOut: GainNode;
    masterGain: GainNode;
    distortion: WaveShaperNode;
    distortionPre: GainNode;
    distortionOut: GainNode;
    limiter: DynamicsCompressorNode;
};

let engineNodes: EngineNodes | undefined;

let buffers: { [k in Track]?: AudioBuffer } | undefined;

export type DrumMachine = {
    stepRefs: { [k in Track]?: MutableRefObject<HTMLDivElement[]> } | undefined;
    unlocked: boolean;
    tempo: number;
    master: number;
    isPlaying: boolean;
    initiated: boolean;
    context: AudioContext | undefined;
    distortionOn: boolean;
    loop: Loop;
    init: () => Promise<void>;
    nextNote: () => void;
    playSample: (
        audioBuffer: AudioBuffer,
        instrNode: AudioNode,
        time: number
    ) => void;
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

type DrumMachineStore = DrumMachine;

const useDrumMachineStore = create<DrumMachineStore>()((set, get) => ({
    stepRefs: {},
    unlocked: false,
    tempo: 130,
    master: 100,
    isPlaying: false,
    initiated: false,
    context: undefined, // audio context
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

        buffers = { ...(await setupSample(context)) };
        engineNodes = { ...setupEngineNodes(context) };

        set((state) => ({ ...state, context, initiated: true }));

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
        const { context, distortionOn } = get();

        if (!engineNodes || !context) return;

        const {
            mainDryOut,
            distortionPre,
            distortion,
            distortionOut,
            masterGain,
        } = engineNodes;

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
    },

    scheduleNote: (beatNumber: number, time: number) => {
        if (!buffers || !engineNodes) return;

        const { loop } = get();
        const { gainNodes } = engineNodes;

        sequencer.notesInQueue.push({ note: beatNumber, time: time });

        for (const prop of getObjectKeysUnsafe(loop)) {
            const buffer = buffers[prop];

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
        const { distortionOn } = get();

        if (!engineNodes) return;

        const { distortionOut, mainDryOut } = engineNodes;

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
        if (!engineNodes) return;

        const { gainNodes } = engineNodes;
        const audioNode = gainNodes[instr];

        if (!audioNode) return;

        const newValue = (gainStage[instr] * value) / 100;
        audioNode.gain.value = newValue;
    },

    updateMaster: (value: number) => {
        if (!engineNodes) return;

        const { masterGain } = engineNodes;

        if (masterGain) masterGain.gain.value = value / 100;

        set((state) => ({ ...state, master: value }));
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
