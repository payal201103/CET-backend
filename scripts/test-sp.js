import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_CONFIG } from '../src/database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testSP() {
	let pool;
	try {
		console.log('Connecting to database...');
		pool = await sql.connect(DB_CONFIG);
		console.log('Connected successfully.');

		const filePath = path.resolve(__dirname, '../src/database/SP/sp_CompleteJobCard.sql');
		console.log(`Reading SQL file from: ${filePath}`);
		const sqlContent = fs.readFileSync(filePath, 'utf8');
		const batches = sqlContent.split(/\bGO\b/i);

		for (let i = 0; i < batches.length; i++) {
			let batch = batches[i].trim();
			if (!batch) continue;
			console.log(`Executing Batch ${i + 1}...`);
			try {
				await pool.request().query(batch);
				console.log(`Batch ${i + 1} succeeded.`);
			} catch (err) {
				console.error(`Batch ${i + 1} failed:`, err);
			}
		}
	} catch (err) {
		console.error('Test failed:', err);
	} finally {
		if (pool) {
			await sql.close();
		}
	}
}

testSP();
