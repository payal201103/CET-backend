import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
	server: 'localhost',
	database: process.env.DB_NAME || 'CRM',
	user: process.env.DB_USER || 'sa',
	password: process.env.DB_PASSWORD || 'admin@123',
	port: parseInt(process.env.DB_PORT) || 1433,
	options: {
		encrypt: false,
		trustServerCertificate: true,
	},
};

const migrationFiles = [
	'../src/database/Tables/video_requests_migration.sql',
	'../src/database/SP/sp_GetRejectedVideoRequests.sql',
	'../src/database/SP/sp_ResolveRejectedVideoRequest.sql',
	'../src/database/SP/sp_GetVideoRequestsPending.sql',
	'../src/database/SP/sp_GetVideoRequestsCompleted.sql',
	'../src/database/SP/sp_UpdateVideoRequestPending.sql',
];

async function runMigrations() {
	let pool;
	try {
		pool = await sql.connect(dbConfig);

		for (const fileRelPath of migrationFiles) {
			const filePath = path.resolve(__dirname, fileRelPath);
			const sqlContent = fs.readFileSync(filePath, 'utf8');

			// Split by GO statements
			const batches = sqlContent.split(/\bGO\b/i);

			for (let batch of batches) {
				batch = batch.trim();
				if (!batch) continue;

				try {
					await pool.request().query(batch);
				} catch (err) {
					throw err;
				}
			}
		}
		
		// Check if rejected_video_requests table is empty, and insert some mock data if it is
		const countResult = await pool.request().query('SELECT COUNT(*) as count FROM rejected_video_requests');
		if (countResult.recordset[0].count === 0) {
			await pool.request().query(`
				INSERT INTO rejected_video_requests (jobCardNo, customerName, carDetails, services, videographerName, rejectedDate, rejectionReason, isResolved) VALUES
				('JC-2024-006', 'Sana Ali', 'Lamborghini Urus 2023 · KA03KL2345', 'Wrapping,PPF', 'Aisha K.', '2024-12-09', 'Video footage was blurry and out of focus for most of the walkaround shots.', 0),
				('JC-2024-011', 'Aditya Kumar', 'Mercedes S-Class 2024 · MH04PQ5566', 'Ceramic Coating,Detailing', 'Rahul S.', '2024-12-11', 'Lighting in the bay was too dim, paint finish details were not visible.', 0),
				('JC-2024-014', 'Meera Joshi', 'Range Rover Evoque 2022 · GJ01RS7788', 'Detailing', 'Dev M.', '2024-12-13', 'Customer requested a re-shoot to include the engine bay and interior.', 0)
			`);
		}

		const pendingCount = await pool.request().query('SELECT COUNT(*) as count FROM video_requests_pending');
		if (pendingCount.recordset[0].count === 0) {
			await pool.request().query(`
				INSERT INTO video_requests_pending (jobCardNo, customerName, videoType, status, assignedBy, date, isActive) VALUES
				('JC-0745', 'Dhairya Shah DSA', 'Reel', 'Pending', 'Admin User', '2026-07-14', 1),
				('JC-0753', 'Mihir Sinh', 'YouTube', 'Pending', 'Admin User', '2026-07-17', 1),
				('JC-0758', 'Rakesh Bhai', 'Reel', 'Pending', 'Admin User', '2026-07-18', 1)
			`);
		}

	} catch (err) {
	} finally {
		if (pool) {
			await sql.close();
		}
	}
}

runMigrations();
