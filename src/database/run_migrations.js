import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from 'mssql';
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
	},
};

async function runMigrations() {
	console.log('Connecting to database...');
	const pool = await sql.connect(DB_CONFIG);
	console.log('Connected successfully.');

	// 1. Run Tables migrations
	const tablesDir = path.resolve(__dirname, 'Tables');
	if (fs.existsSync(tablesDir)) {
		const files = fs.readdirSync(tablesDir).filter(f => f.endsWith('.sql'));
		console.log(`Found ${files.length} table migrations.`);
		for (const file of files) {
			try {
				console.log(`Running table migration: ${file}`);
				const content = fs.readFileSync(path.join(tablesDir, file), 'utf-8');
				const batches = content
					.split(/^\s*GO\s*$/im)
					.map(b => b.trim())
					.filter(b => b.length > 0);

				for (const batch of batches) {
					await pool.request().query(batch);
				}
				console.log(`  ✓ Successfully ran ${file}`);
			} catch (err) {
				if (err.message.includes('already an object named') || err.message.includes('Column already exists') || err.message.includes('already exists')) {
					console.log(`  - Table/Column already exists (skipped): ${file}`);
				} else {
					console.error(`  ✖ Failed to run table migration ${file}:`, err.message);
				}
			}
		}
	}

	// 2. Compile Stored Procedures
	const spDir = path.resolve(__dirname, 'SP');
	if (fs.existsSync(spDir)) {
		const files = fs.readdirSync(spDir).filter(f => f.endsWith('.sql'));
		console.log(`Found ${files.length} Stored Procedures.`);
		for (const file of files) {
			try {
				console.log(`Compiling SP: ${file}`);
				const content = fs.readFileSync(path.join(spDir, file), 'utf-8');
				const batches = content
					.split(/^\s*GO\s*$/im)
					.map(b => b.trim())
					.filter(b => b.length > 0);

				for (const batch of batches) {
					await pool.request().query(batch);
				}
				console.log(`  ✓ Successfully compiled ${file}`);
			} catch (spErr) {
				console.error(`  ✖ Error in SP compilation ${file}:`, spErr.message);
			}
		}
	}

	console.log('All migrations completed successfully!');
	await pool.close();
}

runMigrations().catch(err => {
	console.error('Migration failed:', err);
	process.exit(1);
});
