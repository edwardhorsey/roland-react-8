

// export let context; // the Audio Context
// export let bufferLoader; // our loaded samples will live here
// export let unlocked = false;

// context = new AudioContext();

// let filenames = [
//   '../../data/sounds/wa_808tape_clap_01_sat.wav',
//   '../../data/sounds/wa_808tape_closedhat_09_sat.wav',
//   '../../data/sounds/wa_808tape_crash_02_sat.wav',
//   '../../data/sounds/wa_808tape_hitom_01_sat.wav',
// '../../data/sounds/wa_808tape_kick_09_sat.wav'
// ]

// async function getFile(audioContext, filepath) {
//   const response = await fetch(filepath);
//   const arrayBuffer = await response.arrayBuffer();
//   const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//   return audioBuffer;
// }

// export async function setupSample() {
//   let array = [];
//   for (let i=0; i<filenames.length; i++){
//     const sample = await getFile(context, filenames[i]);
//     array.push(sample);
//     }
//   return array;
// }

// window.addEventListener(
//   'load',
//   setupSample()
//     .then(buffers => {
//       bufferLoader = buffers;
//       console.log('loaded sounds');
//     }),
//   false
// );
