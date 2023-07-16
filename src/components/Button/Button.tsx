export default function Button({
    text,
    logic,
    className,
}: {
    text: string;
    logic: (() => void) | (() => Promise<void>);
    className?: string;
}) {
    return (
        <button
            type="button"
            className={`flex h-10 w-fit min-w-[4rem] select-none appearance-none flex-col justify-center bg-gray-200 p-3 shadow-md outline-none hover:bg-gray-300 ${
                text === "Clear" ? "mr-1.5" : ""
            }${className ?? ""}}`}
            onClick={void logic}
        >
            {text}
        </button>
    );
}
