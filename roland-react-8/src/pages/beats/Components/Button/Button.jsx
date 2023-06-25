import React, { Component } from "react";
import styles from "./Button.module.scss";

class Button extends Component {
    render() {
        const btnStyles =
            this.props.text === "Clear"
                ? `${styles.button} ${styles.clear}`
                : styles.button;
        return (
            <div className={btnStyles} onClick={this.props.logic}>
                {this.props.text}
            </div>
        );
    }
}

export default Button;
