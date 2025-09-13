import "dotenv/config";
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from "cors";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import prisma from '@/db/prisma';
import responseHandler from "./middleware/response.handler";
import adminAuthRouter from "@/routers/admin.auth.router";

const app = express();
// TEST
const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const corsOptions = {
	origin: process.env.CORS_ORIGIN || "",
	methods: ["GET", "POST", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
}

app.use(cors(corsOptions));
app.use(morgan('dev'))
app.use(cookieParser())
app.use((req: Request, res: Response, next: NextFunction) => responseHandler(req, res, next));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((_req: Request, res: Response, next: NextFunction) => {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
	next();
});


app.use((req: Request, _res: Response, next: NextFunction) => {
	if (NODE_ENV === 'development') {
		console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	}
	next();
});

app.use('/api/admin/auth', adminAuthRouter);

app.get('/health', (_req: Request, res: Response) => {
	res.status(200).json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: NODE_ENV,
	});
});

app.get('/api/status', async (_req: Request, res: Response) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		res.json({
			message: 'API is running',
			version: '1.0.0',
			environment: NODE_ENV,
			database: 'connected',
		});
	} catch (error) {
		res.status(500).json({
			message: 'API is running, but DB connection failed',
			environment: NODE_ENV,
			database: 'disconnected',
			error: (error as Error).message,
		});
	}
});


app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
