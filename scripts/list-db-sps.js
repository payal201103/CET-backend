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

async function listSPs() {
	try {
		const pool = await sql.connect(dbConfig);
		const result = await pool.request().query(`
			SELECT name, create_date, modify_date 
			FROM sys.procedures 
			ORDER BY name;
		`);
		result.recordset.forEach(row => {
		});
		await sql.close();
	} catch (err) {
		console.error('Error fetching SPs:', err);
	}
}

listSPs();
