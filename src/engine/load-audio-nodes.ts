import { makeDistortionCurve } from "~/engine/distortion-curve";

export const gainStage = {
    Master: 0.8,
    clap: 0.9,
    hat: 0.9,
    openHat: 0.8,
    cymbal: 0.7,
    hiTom: 1,
    loTom: 1,
    kick: 1,
} as const;

export const setupGainNodes = (audiocontext: AudioContext) => {
    const createGainNode = (startingValue: number) => {
        const gain = audiocontext.createGain();
        gain.gain.value = parseFloat(`${0.7 * startingValue}`); // 0.7 is starting volume on all knobs
        return gain;
    };

    return {
        clap: createGainNode(gainStage["clap"]),
        hat: createGainNode(gainStage["hat"]),
        openHat: createGainNode(gainStage["openHat"]),
        cymbal: createGainNode(gainStage["cymbal"]),
        hiTom: createGainNode(gainStage["hiTom"]),
        loTom: createGainNode(gainStage["loTom"]),
        kick: createGainNode(gainStage["kick"]),
    };
};

export const createMainDryOut = (audiocontext: AudioContext) => {
    return audiocontext.createGain();
};

export const createMasterGain = (audiocontext: AudioContext) => {
    const masterGain = audiocontext.createGain();
    masterGain.gain.value = 0.8 * gainStage["Master"];
    return masterGain;
};

export const createDistortion = (audiocontext: AudioContext) => {
    const distortion = audiocontext.createWaveShaper();
    distortion.curve = makeDistortionCurve(20, 48000);
    distortion.oversample = "2x";
    return distortion;
};

export const createDistortionPre = (audiocontext: AudioContext) => {
    const distortionPre = audiocontext.createGain();
    distortionPre.gain.value = 0.3;
    return distortionPre;
};

export const createDistortionOut = (audiocontext: AudioContext) => {
    const distortionOut = audiocontext.createGain();
    distortionOut.gain.value = 0.7;
    return distortionOut;
};

export const createLimiter = (audiocontext: AudioContext) => {
    const limiter = audiocontext.createDynamicsCompressor();
    limiter.threshold.value = 0.0;
    limiter.knee.value = 0.0;
    limiter.ratio.value = 20.0;
    limiter.attack.value = 0.005;
    limiter.release.value = 0.005;
    return limiter;
};
