import { useState } from "react";
import { Donut } from "react-dial-knob";
import MuteButton from "~/components/MuteButton";
import useDrumMachineStore from "~/stores/useDrumMachineStore";
import type { Track } from "~/types/tracks";

export default function SampleControls({ title }: { title: Track }) {
    const [state, setState] = useState({
        gain: 70,
        mute: false,
    });

    const updateGain = useDrumMachineStore((state) => state.updateGain);

    const valueChange = (gain: number) => {
        setState((state) => ({ ...state, gain: gain }));
        updateGain(title, state.mute ? 0 : gain);
    };

    const mute = () => {
        if (!state.mute) {
            updateGain(title, 0);
        } else {
            updateGain(title, state.gain);
        }
        setState({ ...state, mute: !state.mute });
    };

    return (
        <article
            className={`flex flex-col rounded-lg bg-gray-100 p-5 shadow-sm`}
        >
            <div className="mx-auto">
                <Donut
                    diameter={80}
                    min={0}
                    max={100}
                    font-size={10}
                    step={5}
                    value={state.gain}
                    theme={{
                        donutThickness: 20,
                        donutColor: "Black",
                    }}
                    onValueChange={valueChange}
                    ariaLabelledBy={title}
                ></Donut>
            </div>
            <label id={title}>Gain</label>
            <MuteButton text={title} logic={mute} muted={state.mute} />
        </article>
    );
}
