import React, { Component } from "react";
import styles from "./FXButton.module.scss";

class FXButton extends Component {
    render() {
        return (
            <div
                className={
                    this.props.dist
                        ? `${styles.FXButton} ${styles.on}`
                        : `${styles.FXButton} ${styles.off}`
                }
                onClick={this.props.logic}
            >
                <h3>{this.props.text}</h3>
            </div>
        );
    }
}

export default FXButton;
