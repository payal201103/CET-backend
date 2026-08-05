export class CustomError extends Error {
	constructor(message, statusCode = 500, code) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		this.code = code;

		Error.captureStackTrace(this, this.constructor);
	}
}

export const createError = (message, statusCode = 500, code) => {
	return new CustomError(message, statusCode, code);
};

export const errorHandler = (error, req, res, _next) => {
	const statusCode = error.statusCode || 500;
	const message = error.message || 'Internal Server Error';
	const isOperational = error.isOperational || false;

	console.error('Error Details:', {
		message: error.message,
		stack: error.stack,
		url: req.url,
		method: req.method,
		ip: req.ip,
		userAgent: req.get('User-Agent'),
		timestamp: new Date().toISOString(),
	});

	if (process.env.NODE_ENV === 'development') {
		res.status(statusCode).json({
			message,
			error: {
				stack: error.stack,
				code: error.code,
			},
		});
		return;
	}

	if (isOperational) {
		res.status(statusCode).json({
			message,
			code: error.code,
		});
	} else {
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
