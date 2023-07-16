import React, { useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../data/fa-library";
import { api } from "~/utils/api";
import type { Beat } from "@prisma/client";
import type { Loop } from "~/data/loop";

export default function OwnBeats({
    loadLoop,
    loop,
}: {
    loadLoop: (loop: Beat) => void;
    loop: Loop;
}) {
    const [state, setState] = useState({ iconClass: false, beatName: "" });

    const data = api.beats.getUserBeats.useQuery();
    const saveBeat = api.beats.saveUserBeat.useMutation();
    const deleteBeat = api.beats.deleteUserBeat.useMutation();
    const userBeats = data.data ?? [];

    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const renderOptions = () => {
        return userBeats.map((beat, index) => {
            return (
                <option key={index} value={beat.id}>
                    {beat.name}
                </option>
            );
        });
    };

    const handleLoadLoop = (event: SyntheticEvent<HTMLSelectElement>) => {
        const beatId = event.currentTarget.value;

        if (beatId) {
            const loop = userBeats.find((beat) => beat.id === beatId);

            if (loop) {
                loadLoop(loop);
            }
        }
    };

    const storeName = (event: SyntheticEvent<HTMLInputElement>) => {
        setState({ ...state, beatName: event.currentTarget.value });
        const input = inputRef.current;
        if (input) input.style.boxShadow = "none";
    };

    const saveLoop = () => {
        if (state.beatName) {
            console.log("To store: ", state.beatName, loop);

            saveBeat.mutate({
                name: state.beatName,
                loop: loop,
            });

            setState({ ...state, iconClass: true });
        } else {
            if (inputRef.current) {
                inputRef.current.style.boxShadow =
                    "inset 0 0 8px rgba(114, 47, 55, 0.7)";
            }
        }
        setTimeout(() => {
            setState({ ...state, iconClass: false });
        }, 1000);
    };

    const saveBeatSuccess = saveBeat.isSuccess;

    useEffect(() => {
        if (saveBeatSuccess && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [saveBeatSuccess]);

    const handleDeletePattern = () => {
        const select = selectRef.current;

        if (select) {
            const beatId = select.value;

            if (beatId) {
                deleteBeat.mutate(
                    { id: beatId },
                    {
                        onSuccess: () => {
                            void data.refetch();
                        },
                    }
                );
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
                        <option value={undefined}>--- Select a beat ---</option>
                        {renderOptions()}
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
                        placeholder="Name your beat"
                        required
                        onChange={storeName}
                        className="mr=1 w-40 appearance-none border border-gray-900 p-1 text-sm outline-none focus:outline-none"
                    />
                    <button
                        type="button"
                        className="text-2xl"
                        onClick={saveLoop}
                    >
                        <FontAwesomeIcon icon={["fas", "save"]} />
                    </button>
                </div>
            </div>
        </div>
    );
}
