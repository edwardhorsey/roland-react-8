import React from "react";
import InstrumentControls from "~/components/InstrumentControls";
import SampleControls from "~/components/SampleControls";
import { tracks } from "~/types/tracks";

export default function MachineKnobs() {
    return (
        <>
            <article>
                <InstrumentControls />
            </article>
            <article className="flex w-full min-w-[1100px] justify-evenly">
                {tracks.map((sample, index) => {
                    return <SampleControls key={index} title={sample} />;
                })}
            </article>
        </>
    );
}
