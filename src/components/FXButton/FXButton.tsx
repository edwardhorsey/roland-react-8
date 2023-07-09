export default function FXButton({
    dist,
    logic,
    text,
}: {
    dist: boolean;
    logic: () => void;
    text: string;
}) {
    return (
        <button
            className={`flex h-16 select-none appearance-none items-center justify-center p-2.5 shadow-md outline-none ${
                dist
                    ? "bg-red-300 hover:bg-red-400"
                    : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={logic}
        >
            <h3>{text}</h3>
        </button>
    );
}
