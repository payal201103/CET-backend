import cors from 'cors';
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import config from './config/index.js';
import ResponseHandler from './utils/responseHandler.js';
import logger from './utils/logger.js';
import { errorHandler } from './utils/errorHandler.js';
import routes from './routes/v1/index.js';
import healthRoute from './routes/v1/health.route.js';
import { initializeDatabase, closeDatabase } from './database/index.js';
import {
	generalRateLimiter,
	apiRateLimiter,
	healthRateLimiter,
	developmentRateLimiter,
} from './middlewares/rateLimit.middlewares.js';

const app = express();
const port = config.server.port;
const server = http.createServer(app);

app.use((req, res, next) => {
	if (req.url && req.url.includes('//')) {
		req.url = req.url.replace(/\/+/g, '/');
	}
	next();
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
	cors({
		origin: true,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-branch-id', 'X-Branch-Id', 'Accept', 'Origin'],
	})
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(logger.logRequest.bind(logger));

app.use((req, res, next) => {
	res.handler = new ResponseHandler(req, res);
	next();
});

app.use(config.server.nodeEnv === 'development' ? developmentRateLimiter : generalRateLimiter);

app.use('/api/ping', healthRateLimiter, healthRoute);
app.use('/ping', healthRateLimiter, healthRoute);

app.use('/api/v1', apiRateLimiter, routes);
app.use('/api', apiRateLimiter, routes);
app.use('/', apiRateLimiter, routes);

app.use(errorHandler);

const startServer = async () => {
	try {
		await initializeDatabase();

		server.listen(port, () => {
			logger.info(`Server started successfully on port ${port}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

process.on('SIGINT', async () => {
	await closeDatabase();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	await closeDatabase();
	process.exit(0);
});

startServer();
