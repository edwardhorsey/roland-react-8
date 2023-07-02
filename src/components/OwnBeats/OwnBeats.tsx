import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import styles from "./OwnBeats.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../data/fa-library";
import { api } from "~/utils/api";
import { Beat } from "@prisma/client";

export default function OwnBeats({
    loadLoop,
    loop,
    deletePattern,
}: {
    loadLoop: (loop: Beat) => void;
    loop: Beat;
    deletePattern: (id: string) => void;
}) {
    const [state, setState] = useState({ iconClass: false, beatName: "" });

    const data = api.beats.getUserBeats.useQuery();
    console.log(data);
    const saveBeat = api.beats.saveUserBeat.useMutation();
    console.log(saveBeat);

    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const renderOptions = () => {
        return (data.data ?? []).map((beat, index) => {
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
            const loop = (data.data ?? []).find((beat) => beat.id === beatId);

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

    const handleDeletePattern = () =>
        selectRef.current && deletePattern(selectRef.current.value);

    return (
        <div className={styles.ownBeats}>
            <div className={styles.selectAndStore}>
                <p>Select a beat to load</p>
                <div className={styles.pick}>
                    <select
                        ref={selectRef}
                        name="Your loops"
                        onChange={handleLoadLoop}
                    >
                        <option value={undefined}>--- Select a beat ---</option>
                        {renderOptions()}
                    </select>
                    <span onClick={handleDeletePattern}>
                        <FontAwesomeIcon icon={["fas", "trash-alt"]} />
                    </span>
                </div>
                <p>Save your beat</p>
                <div className={styles.store}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Name your beat"
                        required
                        onChange={storeName}
                    />
                    <button
                        type="button"
                        className={state.iconClass ? styles.success : ""}
                        onClick={saveLoop}
                    >
                        <FontAwesomeIcon icon={["fas", "save"]} />
                    </button>
                </div>
            </div>
        </div>
    );
}
