import config from '../config/index.js';

const LogLevel = {
	ERROR: 'error',
	WARN: 'warn',
	INFO: 'info',
	DEBUG: 'debug',
};

class Logger {
	getTimestamp() {
		return new Date().toISOString();
	}

	formatMessage(level, message, context) {
		const timestamp = this.getTimestamp();
		const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
		return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
	}

	shouldLog(level) {
		const levels = {
			[LogLevel.ERROR]: 0,
			[LogLevel.WARN]: 1,
			[LogLevel.INFO]: 2,
			[LogLevel.DEBUG]: 3,
		};

		const currentLevel = config.server.nodeEnv === 'production' ? LogLevel.INFO : LogLevel.DEBUG;

		return levels[level] <= levels[currentLevel];
	}

	error(message, context) {
		if (this.shouldLog(LogLevel.ERROR)) {
			console.error(this.formatMessage(LogLevel.ERROR, message, context));
		}
	}

	warn(message, context) {
		if (this.shouldLog(LogLevel.WARN)) {
			console.warn(this.formatMessage(LogLevel.WARN, message, context));
		}
	}

	info(message, context) {
		if (this.shouldLog(LogLevel.INFO)) {
			console.info(this.formatMessage(LogLevel.INFO, message, context));
		}
	}

	debug(message, context) {
		if (this.shouldLog(LogLevel.DEBUG)) {
			console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
		}
	}

	logRequest(req, res, next) {
		const start = Date.now();

		res.on('finish', () => {
			const duration = Date.now() - start;
			const context = {
				method: req.method,
				url: req.url,
				statusCode: res.statusCode,
				duration: `${duration}ms`,
				ip: req.ip,
				userAgent: req.get('User-Agent'),
				userId: req.user ? req.user.userId : undefined,
			};

			if (res.statusCode >= 400) {
				this.error(`Request failed: ${req.method} ${req.url}`, context);
			} else {
				this.info(`Request completed: ${req.method} ${req.url}`, context);
			}
		});

		next();
	}
}

export default new Logger();
