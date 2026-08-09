import path from 'path';
import { fileURLToPath } from 'url';
import Joi from 'joi';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = Joi.object({
	DB_SERVER: Joi.string().required(),
	DB_NAME: Joi.string().required(),
	DB_USER: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_PORT: Joi.number().required(),
	DB_ENCRYPT: Joi.boolean().default(false),
	DB_TRUST_SERVER_CERTIFICATE: Joi.boolean().default(false),
	DB_REQUEST_TIMEOUT: Joi.number().default(30000),
	DB_POOL_MAX: Joi.number().default(10),
	DB_POOL_MIN: Joi.number().default(0),
	DB_POOL_IDLE_TIMEOUT: Joi.number().default(30000),
	JWT_SECRET: Joi.string().default('default-jwt-secret-key-for-dev'),
	JWT_EXPIRES_IN: Joi.string().default('2d'),
	PORT: Joi.number().default(5000),
	NODE_ENV: Joi.string().default('development'),
	CORS_ORIGIN: Joi.string().default('*'),
	RATE_LIMIT_WINDOW_MS: Joi.number().default(300000),
	RATE_LIMIT_AUTH_WINDOW_MS: Joi.number().default(900000),
	RATE_LIMIT_HEALTH_WINDOW_MS: Joi.number().default(60000),
}).unknown();

const parseEnv = () => {
	const { error, value } = envSchema.validate(process.env, {
		abortEarly: false,
		stripUnknown: true,
	});

	if (error) {
		console.error('Environment variable validation error:');
		error.details.forEach((err) => {
			console.error(`- ${err.path.join('.')}: ${err.message}`);
		});
		process.exit(1);
	}
	return value;
};

const env = parseEnv();

const config = {
	database: {
		server: env.DB_SERVER,
		database: env.DB_NAME,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		port: env.DB_PORT,
		encrypt: env.DB_ENCRYPT,
		trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE,
		requestTimeout: env.DB_REQUEST_TIMEOUT,
		pool: {
			max: env.DB_POOL_MAX,
			min: env.DB_POOL_MIN,
			idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT,
		},
	},
	jwt: {
		secret: env.JWT_SECRET,
		expiresIn: env.JWT_EXPIRES_IN,
	},
	server: {
		port: env.PORT,
		nodeEnv: env.NODE_ENV,
		corsOrigin: env.CORS_ORIGIN,
	},
	rateLimit: {
		windowMs: env.RATE_LIMIT_WINDOW_MS,
		authWindowMs: env.RATE_LIMIT_AUTH_WINDOW_MS,
		healthWindowMs: env.RATE_LIMIT_HEALTH_WINDOW_MS,
	},
};

export default config;
