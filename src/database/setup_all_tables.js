import sql from 'mssql';
import config from '../config/index.js';

const DB_CONFIG = {
	server: config.database.server,
	database: config.database.database,
	user: config.database.user,
	password: config.database.password,
	port: config.database.port,
	options: {
		encrypt: true,
		trustServerCertificate: true,
		enableArithAbort: true,
		requestTimeout: 30000,
		connectTimeout: 30000,
	},
};

async function testAndSetup() {
	console.log(`Connecting to SQL Server: ${DB_CONFIG.server}, Database: ${DB_CONFIG.database}...`);
	try {
		const pool = await sql.connect(DB_CONFIG);
		console.log('Connected successfully!');

		const result = await pool.request().query("SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE'");
		console.log('Existing tables:', result.recordset.map(r => r.table_name));

		await pool.close();
	} catch (err) {
		console.error('Database Connection Error:', err.message);
	}
}

testAndSetup();
