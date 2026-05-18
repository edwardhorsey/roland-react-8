export const tracks = [
    "clap",
    "hat",
    "openHat",
    "cymbal",
    "hiTom",
    "loTom",
    "kick",
] as const;

export const trackNames = {
    clap: "Clap",
    hat: "Hat",
    openHat: "Open Hat",
    cymbal: "Cymbal",
    hiTom: "Hi Tom",
    loTom: "Lo Tom",
    kick: "Kick",
} as const;

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
export type Track = ArrayElement<typeof tracks>;
