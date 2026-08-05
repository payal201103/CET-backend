import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
	server: 'localhost',
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT) || 1433,
	options: {
		encrypt: false,
		trustServerCertificate: true,
	},
};

async function test() {
	console.log('Connecting with config:', {
		server: dbConfig.server,
		database: dbConfig.database,
		user: dbConfig.user,
		port: dbConfig.port,
		encrypt: dbConfig.options.encrypt,
		trustServerCertificate: dbConfig.options.trustServerCertificate
	});
	try {
		const pool = await sql.connect(dbConfig);
		console.log('Successfully connected to the database!');
		const result = await pool.request().query('SELECT @@VERSION as version');
		console.log('SQL Server version:', result.recordset[0].version);
		await sql.close();
	} catch (err) {
		console.error('Database connection failed:', err);
	}
}

test();
