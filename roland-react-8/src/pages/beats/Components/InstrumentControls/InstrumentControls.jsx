import React, { Component } from "react";
import styles from "./InstrumentControls.module.scss";
import Button from "../Button";
import FXButton from "../FXButton";
// import Hosting from '../Hosting';
import { Donut } from "react-dial-knob";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../data/fa-library";
import OwnBeats from "../OwnBeats";

class InstrumentControls extends Component {
    state = {
        tempo: 130,
        master: 80,
        distortion: false,
        isPlaying: false,
    };

    playPause = () => {
        this.state.isPlaying ? this.props.stop() : this.props.start();
        this.setState({ isPlaying: !this.state.isPlaying });
    };

    reset = () => {
        this.setState({ isPlaying: false });
        this.props.reset();
    };

    tempoChange = (tempo) => {
        this.setState({ tempo });
        this.props.updateTempo(tempo);
    };

    masterChange = (master) => {
        this.setState({ master });
        this.props.updateMaster(master);
    };

    render() {
        const { distortionOn, distorted } = this.props;
        const { tempo, master, isPlaying } = this.state;

        const playButton = isPlaying ? (
            <Button text={"Pause"} logic={this.playPause} />
        ) : (
            <Button text={"Play"} logic={this.playPause} />
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
                            <FontAwesomeIcon icon={["fab", "github"]} />
                        </a>
                    </div>
                </div>
                <section className={styles.instrKnobs}>
                    <div className={styles.playButtons}>
                        {playButton}
                        <Button text={"Stop"} logic={this.reset} />
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
                        onValueChange={this.tempoChange}
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
                        onValueChange={this.masterChange}
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
                {/* <Hosting loop={this.props.loop} loadLoop={this.props.loadLoop} /> */}
                <OwnBeats userBeats={[]} loop={this.props.loop} />
            </section>
        );
    }
}

export default InstrumentControls;

// https://pavelkukov.github.io/react-dial-knob/iframe.html?id=knob-skins--donut&knob-Diameter=180&knob-Min=0&knob-Max=10&knob-Step=1&knob-Value=3&knob-Thickness=15&knob-Color=#1BA098&knob-Background=#e1e1e1&knob-Background (Max reached)=#051622&knob-Center Color=#fff&knob-Focused Center Color=#F7F4E9
