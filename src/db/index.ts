import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

declare global {
    var __prisma: ExtendedPrismaClient | undefined;
}
const createPrismaClient = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        errorFormat: "minimal",
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
};

const prisma = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "development") {
    global.__prisma = prisma;
}

process.on("beforeExit", async () => {
    await prisma.$disconnect();
});

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export default prisma;
