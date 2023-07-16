import React, { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import Step from "~/components/Step";
import Button from "~/components/Button";
import type { Track } from "~/types/tracks";

export default function ProgramSteps({
    title,
    storeStepRefs,
    clearLoop,
    fillLoop,
    updateLoop,
    loop,
}: {
    title: Track;
    storeStepRefs: (
        title: Track,
        stepRefs: MutableRefObject<HTMLDivElement[]>
    ) => void;
    clearLoop: (title: Track) => void;
    fillLoop: (title: Track) => void;
    updateLoop: (step: number, newState: 0 | 1, title: Track) => void;
    loop: number[];
}) {
    const stepRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        storeStepRefs(title, stepRefs);
    }, []);

    const renderSteps = (num: number) =>
        [...Array(num).keys()].map((_, i) => {
            return (
                <Step
                    stepRefs={stepRefs}
                    // handleClick={handleClick}
                    step={i}
                    key={i}
                    logic={(step, newState) =>
                        updateLoop(step, newState, title)
                    }
                    loop={loop}
                    // group={(i + 1) % 4 === 0 ? true : false}
                />
            );
        });

    const steps = renderSteps(16);

    return (
        <article className="flex h-12 min-w-[1000px] items-center justify-evenly">
            <h3 className="w-20 text-xl font-bold">{title}</h3>
            <section className="flex">{steps}</section>
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
