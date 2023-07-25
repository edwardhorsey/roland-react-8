import React from "react";
import ProgramSteps from "~/components/ProgramSteps";
import { tracks } from "~/types/tracks";

export default function MachineSequencer() {
    return (
        <section className="flex min-w-[1100px] flex-col rounded-lg bg-gray-100 p-5 shadow-sm">
            {tracks.map((sample, index) => {
                return <ProgramSteps key={index} title={sample} />;
            })}
        </section>
    );
}
