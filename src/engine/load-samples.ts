import { filenames } from "~/lib/filenames";
import { getObjectKeysUnsafe } from "~/lib/helpers";
import type { Track } from "~/types/tracks";

const getFile = async (audioContext: AudioContext, filepath: string) => {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};

export const setupSample = async (audioContext: AudioContext) => {
    const obj: { [k in Track]?: AudioBuffer } = {};
    for (const prop of getObjectKeysUnsafe(filenames)) {
        const sample = await getFile(audioContext, filenames[prop]);
        obj[prop] = sample;
    }
    return obj;
};
