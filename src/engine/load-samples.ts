import { filenames } from "~/data/filenames";

const getFile = async (audioContext: AudioContext, filepath: string) => {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};

export const setupSample = async (audioContext: AudioContext) => {
    const obj = {};
    for (const prop in filenames) {
        const sample = await getFile(audioContext, filenames[prop]);
        obj[prop] = sample;
    }
    return obj;
};
