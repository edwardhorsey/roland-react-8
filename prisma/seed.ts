import { prisma } from "../src/server/db";

async function main() {
    const beatId = "1";
    const userId = "1";

    await prisma.user.upsert({
        where: {
            id: userId,
        },
        create: {
            id: userId,
            email: "test@email.com",
            image: "https://cdn.discordapp.com/avatars/727786573760036876/b7b90b03a1ea53e74c9ae0ed831b81cf.png",
            name: "Test",
            beats: {
                create: [
                    {
                        id: beatId,
                        name: "My First Beat",
                        clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                        cymbal: [
                            0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        ],
                        hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                        openHat: [
                            0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                        ],
                        hiTom: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                        loTom: [0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1],
                        kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                    },
                ],
            },
        },
        update: {},
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
