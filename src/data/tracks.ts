export const tracks = [
    "clap",
    "hat",
    "openHat",
    "cymbal",
    "hiTom",
    "loTom",
    "kick",
] as const;

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
export type Track = ArrayElement<typeof tracks>;
