import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import prisma from "@/db/prisma";
import responseHandler from "./middleware/response.handler";
import eventRouter from "@/routers/event.router";
import memberRouter from "./routers/member.router";
import userRouter from "./routers/user.router";
import { blockSignup } from "./middleware/block-signup.middleware";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import tagRouter from "./routers/tag.router";
import contributorRouter from "./routers/contributor.router";
import projectRouter from "./routers/project.router";

const requiredEnvVars = [
  'CORS_ORIGIN',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL'
];

// OPTIONAL ENV VARS
const optionalEnvVars = ["GITHUB_CLIENT_ID", "GITHUB_SECRET"];
optionalEnvVars.forEach((env) => {
  if (!process.env[env]) {
    process.env[env] = "";
  }
  console.info(`${env} IS ${process.env[env] ? "CONFIGURED" : "NOT CONFIGURED DEFAULTING TO EMPTY STRING"}`);
});



function validateEnvironment() {
  const missing = requiredEnvVars.filter(env => !process.env[env]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.log('💡 Please check your .env file and ensure all required variables are set');
    process.exit(1);
  }
  console.log('✅ Environment variables validated');
}

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
    process.exit(1);
  }
}

const app = express();
const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => responseHandler(req, res, next));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (NODE_ENV === "development") {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Block public user registration
app.use(blockSignup);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api/members", memberRouter);
app.use("/api/users", userRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

app.get("/api/status", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      message: "API is running",
      version: "1.0.0",
      environment: NODE_ENV,
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      message: "API is running, but DB connection failed",
      environment: NODE_ENV,
      database: "disconnected",
      error: (error as Error).message,
    });
  }
});

app.use("/api/event", eventRouter);
app.use("/api/members", memberRouter);
app.use("/api/tags", tagRouter);
app.use("/api/contributors", contributorRouter);
app.use("/api/projects", projectRouter);

async function startServer() {
  try {
    console.log('🚀 Starting DevSphere Backend...');
    
    
    // SO I FOUND OUT THAT IN VITEST THE NODE_ENV IS SET TO "test"
    // SO NO NEED TO SET IT MANUALLY IN GITHUB ACTIONS
    if(NODE_ENV != "test") {
      validateEnvironment();
      await checkDatabaseConnection();
    }
    
    // Start the server
    app.listen(port, () => {
      console.log(`🌐 Server running on port ${port}`);
      console.log(`📊 Environment: ${NODE_ENV}`);
      console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN}`);
      console.log('✨ Server startup complete!');
    });
    
  } catch (error) {
    console.error('💥 Server startup failed:', (error as Error).message);
    process.exit(1);
  }
}

// Start the server
startServer();

// FOR TESTING
export default app;
