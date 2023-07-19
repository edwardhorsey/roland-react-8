import React from "react";
import Button from "./Button";
import FXButton from "./FXButton";
import { Donut } from "react-dial-knob";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "~/lib/fa-library";
import OwnBeats from "./OwnBeats";
import { signIn, useSession } from "next-auth/react";
import useDrumMachineStore from "~/stores/useDrumMachineStore";
import { shallow } from "zustand/shallow";

export default function InstrumentControls() {
    const { data: sessionData } = useSession();

    const {
        master,
        tempo,
        isPlaying,
        updateTempo,
        updateMaster,
        start,
        stop,
        reset,
        distortionOn,
        distorted,
        loop,
        loadLoop,
    } = useDrumMachineStore(
        (state) => ({
            master: state.master,
            tempo: state.tempo,
            isPlaying: state.isPlaying,
            updateTempo: state.updateTempo,
            updateMaster: state.updateMaster,
            start: state.start,
            stop: state.stop,
            reset: state.reset,
            distortionOn: state.toggleDistortion,
            distorted: state.distortionOn,
            loop: state.loop,
            loadLoop: state.loadLoop,
        }),
        shallow
    );

    return (
        <section className="flex min-w-[1100px] justify-evenly rounded-lg bg-gray-100 p-5 shadow-sm">
            <div>
                <h2 className="text-2xl font-bold">Roland-React-8</h2>
                <h3 className="text-xl font-bold">Instrument Controls</h3>
                <div className="mt-2.5 text-left">
                    <p>
                        {" "}
                        <span role="img" aria-label="dancing">
                            🎛️🎚️🕺💃
                        </span>
                    </p>
                    <p className="italic">built by Edward Horsey</p>
                    <a
                        href="https://github.com/edwardhorsey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl text-black visited:text-black "
                    >
                        <FontAwesomeIcon
                            icon={["fab", "github"]}
                            className="h-6 w-6 text-base"
                        />
                    </a>
                </div>
            </div>
            <section className="flex w-3/5 justify-evenly">
                <div className="flex w-16 flex-col gap-2.5">
                    {isPlaying ? (
                        <Button text={"Pause"} logic={stop} />
                    ) : (
                        <Button text={"Play"} logic={start} />
                    )}
                    <Button text={"Stop"} logic={reset} />
                </div>
                <Donut
                    diameter={105}
                    min={30}
                    max={240}
                    step={1}
                    value={tempo}
                    theme={{
                        donutColor: "Black",
                        donutThickness: 25,
                    }}
                    onValueChange={updateTempo}
                    ariaLabelledBy={"tempo"}
                >
                    <label id={"tempo"}>Tempo</label>
                </Donut>
                <Donut
                    diameter={105}
                    min={0}
                    max={100}
                    step={1}
                    value={master}
                    theme={{
                        donutColor: "Black",
                        donutThickness: 25,
                    }}
                    onValueChange={updateMaster}
                    ariaLabelledBy={"master-gain"}
                >
                    <label id={"master-gain"}>Master Gain</label>
                </Donut>
                <FXButton
                    text={"DISTORTION"}
                    logic={distortionOn}
                    dist={distorted}
                />
            </section>
            {sessionData ? (
                <OwnBeats loop={loop} loadLoop={loadLoop} />
            ) : (
                <Button
                    logic={() => {
                        signIn()
                            .then((res) => console.log(res))
                            .catch((err) => console.log(err));
                    }}
                    text="sign in"
                />
            )}
        </section>
    );
}

// https://pavelkukov.github.io/react-dial-knob/iframe.html?id=knob-skins--donut&knob-Diameter=180&knob-Min=0&knob-Max=10&knob-Step=1&knob-Value=3&knob-Thickness=15&knob-Color=#1BA098&knob-Background=#e1e1e1&knob-Background (Max reached)=#051622&knob-Center Color=#fff&knob-Focused Center Color=#F7F4E9
