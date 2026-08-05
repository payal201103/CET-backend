import sql from 'mssql';
import config from '../config/index.js';
import logger from '../utils/logger.js';

export const DB_CONFIG = {
	server: config.database.server,
	database: config.database.database,
	user: config.database.user,
	password: config.database.password,
	port: config.database.port,
	options: {
		encrypt: config.database.encrypt,
		trustServerCertificate: config.database.trustServerCertificate,
		enableArithAbort: true,
		requestTimeout: config.database.requestTimeout,
	},
	pool: {
		max: config.database.pool.max,
		min: config.database.pool.min,
		idleTimeoutMillis: config.database.pool.idleTimeoutMillis,
	},
};

let pool = null;

export const initializeDatabase = async () => {
	try {
		pool = await new sql.ConnectionPool(DB_CONFIG).connect();
		logger.info('Database connected successfully');
	} catch (error) {
		logger.error('Database connection failed', {
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		throw error;
	}
};

export const getConnection = () => {
	if (!pool) throw new Error('Database not initialized. Call initializeDatabase() first.');
	return pool;
};

export const executeQuery = async (query, params) => {
	try {
		const connection = getConnection();
		const request = connection.request();

		if (params) {
			params.forEach((param) => {
				request.input(param.name, param.type, param.value);
			});
		}

		const result = await request.query(query);
		return result.recordset;
	} catch (error) {
		logger.error('Query execution failed:', { error });
		throw error;
	}
};

export const executeStoredProcedure = async (
	procedureName,
	params,
	isMultipleResults = false,
	resultType = 'recordset'
) => {
	try {
		const connection = getConnection();
		const request = connection.request();

		if (params) {
			params.forEach((param) => {
				request.input(param.name, param.type, param.value);
			});
		}

		if (resultType === 'output') request.output('result', sql.Int);

		const result = await request.execute(procedureName);

		return resultType === 'output'
			? result.output.result
			: isMultipleResults
				? result?.[resultType]
				: result.recordset;
	} catch (error) {
		logger.error('Stored procedure execution failed:', { error });
		throw error;
	}
};

export const executeTransaction = async (callback) => {
	const connection = getConnection();
	const transaction = new sql.Transaction(connection);

	try {
		await transaction.begin();
		const result = await callback(transaction);
		await transaction.commit();
		return result;
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

export const closeDatabase = async () => {
	if (pool) {
		await pool.close();
		pool = null;
		logger.info('Database connection closed');
	}
};

export const isConnected = () => {
	return pool !== null && pool.connected;
};

export const healthCheck = async () => {
	try {
		if (!isConnected()) {
			return false;
		}

		await executeQuery('SELECT 1 as test');
		return true;
	} catch (error) {
		logger.error('Database health check failed:', { error });
		return false;
	}
};

export default {
	initializeDatabase,
	getConnection,
	executeQuery,
	executeStoredProcedure,
	executeTransaction,
	closeDatabase,
	isConnected,
	healthCheck,
};
