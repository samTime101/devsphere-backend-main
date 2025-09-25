import { auditMiddleware } from "@/middleware/audit.middleware";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

function validateDatabaseConfig() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not set in environment variables');
        console.log('💡 Please check your .env file and ensure DATABASE_URL is properly configured');
        console.log('📝 Example: DATABASE_URL="postgresql://username:password@localhost:5432/database"');
        process.exit(1);
    }
}

validateDatabaseConfig();

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

let prisma = global.__prisma ?? createPrismaClient();


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

prisma = auditMiddleware(prisma); 
export default prisma;
