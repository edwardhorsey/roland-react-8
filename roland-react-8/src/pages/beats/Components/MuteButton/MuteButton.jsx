import React, { Component } from "react";
import styles from "./MuteButton.module.scss";

class MuteButton extends Component {
    //styles.muteButtonOn : styles.muteButtonOff

    render() {
        return (
            <div
                className={
                    this.props.muted
                        ? `${styles.muteButton} ${styles.off}`
                        : `${styles.muteButton} ${styles.on}`
                }
                onClick={this.props.logic}
            >
                <h3>{this.props.text}</h3>
            </div>
        );
    }
}

export default MuteButton;
