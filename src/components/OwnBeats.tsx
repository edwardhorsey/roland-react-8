import { useCallback, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "~/lib/fa-library";
import type { Loop } from "~/types/loop";

type SavedBeat = {
    id: string;
    name: string;
    loop: Loop;
    savedAt: string;
};

const STORAGE_KEY = "roland-beats";

function getSavedBeats(): SavedBeat[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as SavedBeat[]) : [];
    } catch {
        return [];
    }
}

function persistBeats(beats: SavedBeat[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beats));
}

export default function OwnBeats({
    loadLoop,
    loop,
}: {
    loadLoop: (loop: Loop) => void;
    loop: Loop;
}) {
    const [savedBeats, setSavedBeats] = useState<SavedBeat[]>(() =>
        getSavedBeats()
    );
    const [beatName, setBeatName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const refreshBeats = useCallback(() => {
        setSavedBeats(getSavedBeats());
    }, []);

    const handleLoadLoop = (event: SyntheticEvent<HTMLSelectElement>) => {
        const beatId = event.currentTarget.value;

        if (beatId) {
            const found = savedBeats.find((b) => b.id === beatId);

            if (found) {
                loadLoop(found.loop);
            }
        }
    };

    const handleSave = () => {
        if (beatName) {
            const beats = getSavedBeats();
            beats.push({
                id: crypto.randomUUID(),
                name: beatName,
                loop: structuredClone(loop),
                savedAt: new Date().toISOString(),
            });
            persistBeats(beats);
            refreshBeats();

            if (inputRef.current) {
                inputRef.current.value = "";
            }
            setBeatName("");
        } else if (inputRef.current) {
            inputRef.current.style.boxShadow =
                "inset 0 0 8px rgba(114, 47, 55, 0.7)";
        }
    };

    const handleDeletePattern = () => {
        const select = selectRef.current;

        if (select) {
            const beatId = select.value;

            if (beatId) {
                persistBeats(getSavedBeats().filter((b) => b.id !== beatId));
                refreshBeats();
            }
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col justify-evenly">
                <p>Select a beat to load</p>
                <div className="flex justify-between">
                    <select
                        ref={selectRef}
                        name="Your loops"
                        onChange={handleLoadLoop}
                        className="mr-1.5 w-40 p-1 text-sm"
                    >
                        <option value="">Select..</option>
                        {savedBeats.map((beat) => (
                            <option key={beat.id} value={beat.id}>
                                {beat.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleDeletePattern}
                        className="appearance-none text-2xl outline-none"
                    >
                        <FontAwesomeIcon icon={["fas", "trash-alt"]} />
                    </button>
                </div>
                <p className="my-1">Save your beat</p>
                <div className="flex items-center justify-between">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Beat name"
                        required
                        onChange={(e) => setBeatName(e.currentTarget.value)}
                        className="mr=1 w-40 appearance-none border border-gray-900 p-1 text-sm outline-none focus:outline-none"
                    />
                    <button
                        type="button"
                        className="text-2xl"
                        onClick={handleSave}
                    >
                        <FontAwesomeIcon icon={["fas", "save"]} />
                    </button>
                </div>
            </div>
        </div>
    );
}
