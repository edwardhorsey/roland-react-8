import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

export const beatsRouter = createTRPCRouter({
    getUserBeats: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.beat.findMany({
            where: {
                userId: ctx.session?.user.id,
            },
        });
    }),
});
