import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const beatsRouter = createTRPCRouter({
    getUserBeats: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.beat.findMany({
            where: {
                userId: ctx.session?.user.id,
            },
        });
    }),
    saveUserBeat: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                loop: z.object({
                    clap: z.array(z.number()),
                    hat: z.array(z.number()),
                    openHat: z.array(z.number()),
                    cymbal: z.array(z.number()),
                    hiTom: z.array(z.number()),
                    loTom: z.array(z.number()),
                    kick: z.array(z.number()),
                }),
            })
        )
        .mutation(({ ctx, input }) => {
            return ctx.prisma.beat.create({
                data: {
                    name: input.name,
                    userId: ctx.session?.user.id,
                    ...input.loop,
                },
            });
        }),
});
