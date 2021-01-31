export const makeDistortionCurve = (amount, sampleRate) => {
  var k = amount,
      n_samples = typeof sampleRate === 'number' ? sampleRate : 44100,
      curve = new Float32Array(n_samples),
      // deg = Math.PI / 180,
      i = 0,
      x;
  for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = (3 + k)*Math.atan(Math.sinh(x*0.25)*5) / (Math.PI + k * Math.abs(x));
  }

  return curve;
}