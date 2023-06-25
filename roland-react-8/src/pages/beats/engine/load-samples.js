const getFile = async (audioContext, filepath) => {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};

export const setupSample = async (audioContext, files) => {
    let obj = {};
    for (let prop in files) {
        const sample = await getFile(audioContext, files[prop]);
        obj[prop] = sample;
    }
    return obj;
};
