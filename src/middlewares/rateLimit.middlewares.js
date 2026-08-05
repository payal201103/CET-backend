import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import config from '../config/index.js';

const createLimiter = ({ windowMs, limit, code, message }) => {
	const body = { status: 'error', message, code };

	return rateLimit({
		windowMs,
		limit,
		message: body,
		standardHeaders: true,
		legacyHeaders: false,
		keyGenerator: (req) => ipKeyGenerator(req.ip || req.connection.remoteAddress || 'unknown'),
		handler: (req, res) => {
			res.status(429).json({ ...body, retryAfter: Math.ceil(windowMs / 1000) });
		},
	});
};

export const generalRateLimiter = createLimiter({
	windowMs: config.rateLimit.windowMs,
	limit: 100,
	code: 'RATE_LIMIT_EXCEEDED',
	message: 'Too many requests from this IP, please try again later.',
});

export const authRateLimiter = createLimiter({
	windowMs: config.rateLimit.authWindowMs,
	limit: 10,
	code: 'AUTH_RATE_LIMIT_EXCEEDED',
	message: 'Too many authentication attempts, please try again later.',
});

export const apiRateLimiter = createLimiter({
	windowMs: config.rateLimit.windowMs,
	limit: 50,
	code: 'API_RATE_LIMIT_EXCEEDED',
	message: 'Too many API requests, please try again later.',
});

export const healthRateLimiter = createLimiter({
	windowMs: config.rateLimit.healthWindowMs,
	limit: 30,
	code: 'HEALTH_RATE_LIMIT_EXCEEDED',
	message: 'Too many health check requests, please try again later.',
});

export const developmentRateLimiter = createLimiter({
	windowMs: config.rateLimit.windowMs,
	limit: 50000,
	code: 'DEV_RATE_LIMIT_EXCEEDED',
	message: 'Too many requests from this IP, please try again later.',
});
