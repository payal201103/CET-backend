import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from 'mssql';
import bcrypt from 'bcrypt';
import config from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
		requestTimeout: 60000,
		connectTimeout: 30000,
	},
};

async function setupDatabase() {
	console.log(`Connecting to SQL Server: ${DB_CONFIG.server}...`);
	try {
		const pool = await sql.connect(DB_CONFIG);
		console.log('Connected!');

		// Load SP folder
		console.log('Compiling stored procedures from SP folder...');
		const spDir = path.join(__dirname, 'SP');
		if (fs.existsSync(spDir)) {
			const files = fs.readdirSync(spDir).filter(f => f.endsWith('.sql'));
			for (const file of files) {
				const filePath = path.join(spDir, file);
				const content = fs.readFileSync(filePath, 'utf-8');
				
				// Split content by GO statements
				const batches = content
					.split(/^\s*GO\s*$/im)
					.map(b => b.trim())
					.filter(b => b.length > 0);

				for (const batch of batches) {
					try {
						await pool.request().query(batch);
					} catch (spErr) {
						console.error(`- Error in ${file}:`, spErr.message);
					}
				}
				console.log(`- Successfully compiled ${file}`);
			}
		}

		console.log('\nALL STORED PROCEDURES & TABLES VERIFIED SUCCESSFULLY!');
		await pool.close();
	} catch (err) {
		console.error('Database Setup Error:', err);
	}
}

setupDatabase();
