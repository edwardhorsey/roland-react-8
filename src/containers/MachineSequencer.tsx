import React from "react";
import type { MutableRefObject } from "react";
import ProgramSteps from "../components/ProgramSteps";
import { tracks } from "~/types/tracks";
import type { Track } from "~/types/tracks";
import type { Loop } from "~/types/loop";

export default function MachineSequencer({
    storeStepRefs,
    updateLoop,
    clearLoop,
    loop,
    fillLoop,
}: {
    storeStepRefs: (
        track: Track,
        refs: MutableRefObject<HTMLDivElement[]>
    ) => void;
    updateLoop: (num: number, onOrOff: 0 | 1, instr: Track) => void;
    clearLoop: (track: Track) => void;
    loop: Loop;
    fillLoop: (track: Track) => void;
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
