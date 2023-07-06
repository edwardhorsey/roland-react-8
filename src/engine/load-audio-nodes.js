import { makeDistortionCurve } from "./distortion-curve";

export const gainStage = {
    Master: 0.8,
    clap: 0.9,
    hat: 0.9,
    openHat: 0.8,
    crash: 0.7,
    hiTom: 1,
    loTom: 1,
    kick: 1,
};

export const setupGainNodes = (audiocontext, files) => {
    let obj = {};
    for (let prop in files) {
        const gain = audiocontext.createGain();
        obj[prop] = gain;
        obj[prop].gain.value = parseFloat(`${0.7 * gainStage[prop]}`); // 0.7 is starting volume on all knobs
    }
    return obj;
};

export const createMainDryOut = (audiocontext) => {
    return audiocontext.createGain();
};

export const createMasterGain = (audiocontext) => {
    let masterGain = audiocontext.createGain();
    masterGain.gain.value = 0.8 * gainStage["Master"];
    return masterGain;
};

export const createDistortion = (audiocontext) => {
    let distortion = audiocontext.createWaveShaper();
    distortion.curve = makeDistortionCurve(20, 48000);
    distortion.oversample = "2x";
    return distortion;
};

export const createDistortionPre = (audiocontext) => {
    let distortionPre = audiocontext.createGain();
    distortionPre.gain.value = 0.3;
    return distortionPre;
};

export const createDistortionOut = (audiocontext) => {
    let distortionOut = audiocontext.createGain();
    distortionOut.gain.value = 0.7;
    return distortionOut;
};

export const createLimiter = (audiocontext) => {
    let limiter = audiocontext.createDynamicsCompressor();
    limiter.threshold.value = 0.0;
    limiter.knee.value = 0.0;
    limiter.ratio.value = 20.0;
    limiter.attack.value = 0.005;
    limiter.release.value = 0.005;
    return limiter;
};
