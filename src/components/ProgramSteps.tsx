import React, { useEffect, useRef } from "react";
import Step from "~/components/Step";
import Button from "~/components/Button";
import type { Track } from "~/types/tracks";
import useDrumMachineStore from "~/stores/useDrumMachineStore";

export default function ProgramSteps({ title }: { title: Track }) {
    const { storeStepRefs, clearLoop, fillLoop, updateLoop, loop } =
        useDrumMachineStore((state) => ({
            storeStepRefs: state.storeStepRefs,
            clearLoop: state.clearLoop,
            fillLoop: state.fillLoop,
            updateLoop: state.updateLoop,
            loop: state.loop,
        }));

    const stepRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        storeStepRefs(title, stepRefs);
    }, [storeStepRefs, title]);

    const thisLoop = loop[title];

    const renderSteps = (num: number) =>
        [...Array(num).keys()].map((_, i) => {
            return (
                <Step
                    stepRefs={stepRefs}
                    step={i}
                    key={i}
                    logic={(step, newState) =>
                        updateLoop(step, newState, title)
                    }
                    loop={thisLoop}
                />
            );
        });

    const steps = renderSteps(16);

    return (
        <article className="flex h-12 min-w-[1000px] items-center justify-evenly">
            <h3 className="w-20 text-xl font-bold">{title}</h3>
            <div className="flex">{steps}</div>
            <Button
                text="Clear"
                logic={() => {
                    clearLoop(title);
                }}
            />
            <Button
                text="Fill"
                logic={() => {
                    fillLoop(title);
                }}
            />
        </article>
    );
}
