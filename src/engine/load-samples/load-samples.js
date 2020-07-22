async function getFile(audioContext, filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

export async function setupSample(audioContext, files) {
    let obj = {};
    for (let prop in files) {
      const sample = await getFile(audioContext, files[prop])
      obj[prop] = sample
    }
  return obj;
}

export function setupGainNodes(audiocontext, files) {
  let obj = {};
  for (let prop in files) {
    const gain = audiocontext.createGain();
    obj[prop] = gain;
  }
  return obj;
}