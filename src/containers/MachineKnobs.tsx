import React from "react";
import InstrumentControls from "../components/InstrumentControls";
import SampleControls from "../components/SampleControls";
import type { Beat } from "@prisma/client";
import { tracks } from "~/data/tracks";
import type { Track } from "~/data/tracks";
import type { Loop } from "~/data/loop";

export default function MachineKnobs({
    updateTempo,
    updateMaster,
    start,
    stop,
    reset,
    updateGain,
    distortionOn,
    distorted,
    loop,
    loadLoop,
}: {
    updateTempo: (tempo: number) => void;
    updateMaster: (master: number) => void;
    start: () => Promise<void>;
    stop: () => void;
    reset: () => void;
    updateGain: (title: Track, gain: number) => void;
    distortionOn: () => void;
    distorted: boolean;
    loop: Loop;
    loadLoop: (loop: Beat) => void;
}) {
    return (
        <>
            <article>
                <InstrumentControls
                    updateTempo={updateTempo}
                    updateMaster={updateMaster}
                    start={start}
                    stop={stop}
                    reset={reset}
                    distortionOn={distortionOn}
                    distorted={distorted}
                    loop={loop}
                    loadLoop={loadLoop}
                />
            </article>
            <article className="flex w-full min-w-[1100px] justify-evenly">
                {tracks.map((sample, index) => {
                    return (
                        <SampleControls
                            key={index}
                            title={sample}
                            updateGain={updateGain}
                        />
                    );
                })}
            </article>
        </>
    );
}
