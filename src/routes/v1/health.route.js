import express from 'express';
import { healthCheck } from '../../database/index.js';
import { STATUS_CODES } from '../../utils/statusCodes.js';

const router = express.Router();

router.get('/', async (_req, res) => {
	let dbStatus = 'up';

	try {
		const isHealthy = await healthCheck();
		dbStatus = isHealthy ? 'up' : 'down';
	} catch {
		dbStatus = 'down';
	}

	res.status(dbStatus === 'up' ? STATUS_CODES.SUCCESS : STATUS_CODES.SERVICE_UNAVAILABLE).json({
		status: 'ok',
		uptime: process.uptime(),
		db: dbStatus,
		timestamp: new Date().toISOString(),
	});
});

export default router;
