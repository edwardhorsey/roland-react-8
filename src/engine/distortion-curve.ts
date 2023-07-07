export const makeDistortionCurve = (amount: number, sampleRate: number) => {
    const k = amount;
    const n_samples = typeof sampleRate === "number" ? sampleRate : 44100;
    const curve = new Float32Array(n_samples);
    let x: number | undefined;

    for (let i = 0; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;

        curve[i] =
            ((3 + k) * Math.atan(Math.sinh(x * 0.25) * 5)) /
            (Math.PI + k * Math.abs(x));
    }

    return curve;
};
