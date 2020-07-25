import { makeDistortionCurve } from "./distortion-curve";

export const gainStage = { 'Master': 0.8, 'Clap': 0.9, 'Hat': 0.9, 'Open Hat': 0.8, 'Cymbal': 0.7, 'Hi Tom': 1, 'Lo Tom': 1, 'Kick': 1 }

export const setupGainNodes = (audiocontext, files) => {
  let obj = {};
  for (let prop in files) {
    const gain = audiocontext.createGain();
    obj[prop] = gain;
    obj[prop].gain.value = 0.7 * gainStage[prop]; // 0.7 is starting volume on all knobs
  }
  console.log(obj)
  return obj;
}

export const createMainDryOut = (audiocontext) => {
  return audiocontext.createGain();
}

export const createMasterGain = (audiocontext) => {
  let masterGain = audiocontext.createGain()
  masterGain.gain.value = 0.8 * gainStage['Master']
  return masterGain;
}

export const createDistortion = (audiocontext) => {
  let distortion = audiocontext.createWaveShaper();
  distortion.curve = makeDistortionCurve(20, 48000);
  distortion.oversample = '2x';
  return distortion;
}

export const createDistortionPre = (audiocontext) => {
  let distortionPre = audiocontext.createGain();
  distortionPre.gain.value = 0.3;
  return distortionPre;
}

export const createDistortionOut = (audiocontext) => {
  let distortionOut = audiocontext.createGain();
  distortionOut.gain.value = 0.7;
  return distortionOut;
}

export const createLimiter = (audiocontext) => {
  let limiter = audiocontext.createDynamicsCompressor();
  limiter.threshold.value = 0.0;
  limiter.knee.value = 0.0;
  limiter.ratio.value = 20.0;
  limiter.attack.value = 0.005;
  limiter.release.value = 0.005;
  return limiter;
}