import React, { Component } from "react";
import Step from "../Step";
import styles from "./ProgramSteps.module.scss";
import Button from "../Button";

class ProgramSteps extends Component {
    constructor(props) {
        super(props);
        this.stepRefs = (() =>
            [...Array(16).keys()].map((_) => React.createRef()))();
    }

    componentDidMount() {
        this.props.storeStepRefs(this.props.title, this.stepRefs);
    }

    renderSteps = (num) =>
        [...Array(num).keys()].map((_, i) => {
            return (
                <Step
                    stepRef={this.stepRefs[i]}
                    // handleClick={this.handleClick}
                    step={i}
                    key={i}
                    logic={this.updateLoop}
                    loop={this.props.loop}
                    group={(i + 1) % 4 === 0 ? true : false}
                />
            );
        });

    updateLoop = (num, state) =>
        this.props.updateLoop(num, state, this.props.title);

    render() {
        const steps = this.renderSteps(16);

        return (
            <article className={styles.instrument}>
                <h3>{this.props.title}</h3>
                <section>{steps}</section>
                <Button
                    className={styles.marginRight}
                    text="Clear"
                    logic={() => {
                        this.props.clearLoop(this.props.title);
                    }}
                />
                <Button
                    text="Fill"
                    logic={() => {
                        this.props.fillLoop(this.props.title);
                    }}
                />
            </article>
        );
    }
}

export default ProgramSteps;
