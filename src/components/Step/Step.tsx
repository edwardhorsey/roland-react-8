import type { MutableRefObject } from "react";

export default function Step({
    loop,
    step,
    logic,
    stepRef,
}: {
    loop: number[];
    step: number;
    logic: (step: number, newState: 0 | 1) => void;
    stepRef: MutableRefObject<HTMLDivElement | null>;
}) {
    const sendToLoop = () => {
        const newState = loop[step];
        logic(step, newState === 0 ? 1 : 0);
    };

    const everyFour = (step + 1) % 4 === 0;
    const isOn = loop[step] === 1;

    return (
        <button
            className={`my-1.5 ml-1.5 box-border h-10 w-10 cursor-pointer ${
                everyFour ? "mr-4" : ""
            } ${
                isOn
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-600 hover:bg-gray-700"
            }`}
            onClick={sendToLoop}
            name={`${step}`}
        >
            <div ref={stepRef} className="h-10 w-10"></div>
        </button>
    );
}
