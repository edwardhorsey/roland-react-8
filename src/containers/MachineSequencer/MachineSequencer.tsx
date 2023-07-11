import React from "react";
import type { MutableRefObject } from "react";
import ProgramSteps from "../../Components/ProgramSteps";
import { tracks } from "../../data/tracks";
import type { Beat } from "@prisma/client";

export default function MachineSequencer({
    storeStepRefs,
    updateLoop,
    clearLoop,
    loop,
    fillLoop,
}: {
    storeStepRefs: MutableRefObject<HTMLDivElement[]>;
    updateLoop: (loop: Beat) => void;
    clearLoop: () => void;
    loop: Beat;
    fillLoop: () => void;
}) {
    return (
        <article className="flex min-w-[1100px] flex-col rounded-lg bg-gray-100 p-5 shadow-sm">
            {tracks.map((sample, index) => {
                return (
                    <ProgramSteps
                        key={index}
                        storeStepRefs={storeStepRefs}
                        title={sample}
                        updateLoop={updateLoop}
                        clearLoop={clearLoop}
                        fillLoop={fillLoop}
                        loop={loop[sample]}
                    />
                );
            })}
        </article>
    );
}
