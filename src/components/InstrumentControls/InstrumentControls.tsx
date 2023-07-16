import React, { useState } from "react";
import Button from "../Button/Button";
import FXButton from "../FXButton";
import { Donut } from "react-dial-knob";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../data/fa-library";
import OwnBeats from "../OwnBeats";
import { signIn, useSession } from "next-auth/react";
import type { Beat } from "@prisma/client";
import type { Loop } from "~/data/loop";

function InstrumentControls({
    stop,
    start,
    reset,
    updateTempo,
    updateMaster,
    distortionOn,
    distorted,
    loop,
    loadLoop,
}: {
    stop: () => void;
    start: () => Promise<void>;
    reset: () => void;
    updateTempo: (tempo: number) => void;
    updateMaster: (master: number) => void;
    distortionOn: () => void;
    distorted: boolean;
    loop: Loop;
    loadLoop: (loop: Beat) => void;
}) {
    const [state, setState] = useState({
        tempo: 130,
        master: 80,
        distortion: false,
        isPlaying: false,
    });

    const { data: sessionData } = useSession();

    const playPause = async () => {
        state.isPlaying ? stop() : await start();
        setState({ ...state, isPlaying: !state.isPlaying });
    };

    const handleReset = () => {
        setState({ ...state, isPlaying: false });
        reset();
    };

    const handleTempoChange = (tempo: number) => {
        setState({ ...state, tempo });
        updateTempo(tempo);
    };

    const handlemMsterChange = (master: number) => {
        setState({ ...state, master });
        updateMaster(master);
    };

    const { tempo, master, isPlaying } = state;

    const playButton = isPlaying ? (
        <Button text={"Pause"} logic={playPause} />
    ) : (
        <Button text={"Play"} logic={playPause} />
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
                    {playButton}
                    <Button text={"Stop"} logic={handleReset} />
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
                    onValueChange={handleTempoChange}
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
                    onValueChange={handlemMsterChange}
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

export default InstrumentControls;

// https://pavelkukov.github.io/react-dial-knob/iframe.html?id=knob-skins--donut&knob-Diameter=180&knob-Min=0&knob-Max=10&knob-Step=1&knob-Value=3&knob-Thickness=15&knob-Color=#1BA098&knob-Background=#e1e1e1&knob-Background (Max reached)=#051622&knob-Center Color=#fff&knob-Focused Center Color=#F7F4E9
