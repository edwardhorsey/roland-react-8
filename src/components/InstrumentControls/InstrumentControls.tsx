import React, { Component, useState } from "react";
import styles from "./InstrumentControls.module.scss";
import Button from "../Button";
import FXButton from "../FXButton";
// import Hosting from '../Hosting';
import { Donut } from "react-dial-knob";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../data/fa-library";
import OwnBeats from "../OwnBeats";
import { signIn, signOut, useSession } from "next-auth/react";

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
}: any) {
    const [state, setState] = useState({
        tempo: 130,
        master: 80,
        distortion: false,
        isPlaying: false,
    });

    const { data: sessionData } = useSession();

    const playPause = () => {
        state.isPlaying ? stop() : start();
        setState({ ...state, isPlaying: !state.isPlaying });
    };

    const handleReset = () => {
        setState({ ...state, isPlaying: false });
        reset();
    };

    const handleTempoChange = (tempo) => {
        setState({ ...state, tempo });
        updateTempo(tempo);
    };

    const handlemMsterChange = (master) => {
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
        <section className={styles.instrControls}>
            <div>
                <h2>Roland-React-8</h2>
                <h3>Instrument Controls</h3>
                <div className={styles.aboutMe}>
                    <p>
                        {" "}
                        <span role="img" aria-label="dancing">
                            🎛️🎚️🕺💃
                        </span>
                    </p>
                    <p className={styles.italics}>built by Edward Horsey</p>
                    <a
                        href="https://github.com/edwardhorsey"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={["fab", "github"]}
                            className="text-base"
                        />
                    </a>
                </div>
            </div>
            <section className={styles.instrKnobs}>
                <div className={styles.playButtons}>
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
            {/* <Hosting loop={props.loop} loadLoop={props.loadLoop} /> */}

            {sessionData ? (
                <OwnBeats loop={loop} loadLoop={loadLoop} />
            ) : (
                <button onClick={signIn}>sign in</button>
            )}
        </section>
    );
}

export default InstrumentControls;

// https://pavelkukov.github.io/react-dial-knob/iframe.html?id=knob-skins--donut&knob-Diameter=180&knob-Min=0&knob-Max=10&knob-Step=1&knob-Value=3&knob-Thickness=15&knob-Color=#1BA098&knob-Background=#e1e1e1&knob-Background (Max reached)=#051622&knob-Center Color=#fff&knob-Focused Center Color=#F7F4E9
