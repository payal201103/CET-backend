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
		return pool;
	} catch (error) {
		logger.error('Database connection failed', { message: error.message });
		throw error;
	}
};

export const getConnection = () => {
	if (!pool) {
		throw new Error('Database pool not initialized. Call initializeDatabase() first.');
	}
	return pool;
};

export const executeQuery = async (query, params = []) => {
	const connection = getConnection();
	const request = connection.request();

	if (params && params.length > 0) {
		params.forEach((param) => {
			request.input(param.name, param.type, param.value);
		});
	}

	const result = await request.query(query);
	return result.recordset;
};

export const executeStoredProcedure = async (
	procedureName,
	params = [],
	isMultipleResults = false,
	resultType = 'recordset'
) => {
	const connection = getConnection();
	const request = connection.request();

	if (params && params.length > 0) {
		params.forEach((param) => {
			request.input(param.name, param.type, param.value);
		});
	}

	if (resultType === 'output') {
		request.output('result', sql.Int);
	}

	const result = await request.execute(procedureName);

	if (resultType === 'output') {
		return result.output.result;
	}

	return isMultipleResults ? result?.[resultType] : result.recordset;
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
		if (!isConnected()) return false;
		await executeQuery('SELECT 1 as test');
		return true;
	} catch {
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

