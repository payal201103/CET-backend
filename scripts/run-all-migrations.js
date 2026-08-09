import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_CONFIG } from '../src/database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAll() {
	let pool;
	try {
		console.log('Connecting to database...');
		pool = await sql.connect(DB_CONFIG);
		console.log('Connected successfully.');

		// 1. Run Tables
		const tablesDir = path.resolve(__dirname, '../src/database/Tables');
		const tableFiles = fs.readdirSync(tablesDir).filter(f => f.endsWith('.sql'));
		console.log(`Found ${tableFiles.length} table script files.`);

		for (const file of tableFiles) {
			const filePath = path.join(tablesDir, file);
			const sqlContent = fs.readFileSync(filePath, 'utf8');
			const batches = sqlContent.split(/\bGO\b/i);

			for (let batch of batches) {
				batch = batch.trim();
				if (!batch) continue;
				try {
					await pool.request().query(batch);
					console.log(`  ✓ Table script executed: ${file}`);
				} catch (err) {
					if (err.message.includes('already an object named') || err.message.includes('already exists')) {
						console.log(`  - Table already exists: ${file} (skipped)`);
					} else {
						console.error(`  ✗ Error in ${file}:`, err.message);
					}
				}
			}
		}

		// 2. Run Stored Procedures
		const spDir = path.resolve(__dirname, '../src/database/SP');
		const spFiles = fs.readdirSync(spDir).filter(f => f.endsWith('.sql'));
		console.log(`Found ${spFiles.length} SP script files.`);

		for (const file of spFiles) {
			const filePath = path.join(spDir, file);
			const sqlContent = fs.readFileSync(filePath, 'utf8');
			const batches = sqlContent.split(/\bGO\b/i);

			for (let batch of batches) {
				batch = batch.trim();
				if (!batch) continue;
				try {
					await pool.request().query(batch);
					console.log(`  ✓ SP script executed: ${file}`);
				} catch (err) {
					console.error(`  ✗ Error in SP ${file}:`, err.message);
				}
			}
		}

		console.log('All database migrations completed successfully!');
	} catch (err) {
		console.error('Migration failed:', err);
	} finally {
		if (pool) {
			await sql.close();
		}
	}
}

runAll();
