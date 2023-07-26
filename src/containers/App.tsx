import React from "react";
import MachineSequencer from "~/containers/MachineSequencer";
import MachineKnobs from "~/containers/MachineKnobs";

function App() {
    return (
        <main className="flex flex-col gap-5 bg-green-800 p-5">
            <MachineKnobs />
            <MachineSequencer />
        </main>
    );
}

export default App;
