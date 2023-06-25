import React, { Component } from "react";
import styles from "./Step.module.scss";

class Step extends Component {
    sendToLoop = () => {
        const newState = this.props.loop[this.props.step];
        this.props.logic(this.props.step, newState === 0 ? 1 : 0);
    };

    render() {
        const everyFour =
            (this.props.step + 1) % 4 === 0 ? styles.everyFour : "";
        const stepStyle = this.props.loop[this.props.step]
            ? `${styles.step} ${styles.on} ${everyFour}`
            : `${styles.step} ${styles.off} ${everyFour}`;

        return (
            <div
                className={stepStyle}
                onClick={this.sendToLoop}
                name={this.props.step}
            >
                <div ref={this.props.forwardRef} className={styles.inner}></div>
            </div>
        );
    }
}

export default React.forwardRef((props, ref) => (
    <Step {...props} forwardRef={ref} />
));
