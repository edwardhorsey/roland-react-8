export default function MuteButton({
    muted,
    logic,
    text,
}: {
    muted: boolean;
    logic: () => void;
    text: string;
}) {
    return (
        <div
            className={`user-select-none flex cursor-pointer appearance-none flex-col justify-center p-2.5 shadow-md outline-none ${
                muted
                    ? "bg-red-300 hover:bg-red-400"
                    : "bg-emerald-600 hover:bg-emerald-700"
            }`}
            onClick={logic}
        >
            <h3>{text}</h3>
        </div>
    );
}
