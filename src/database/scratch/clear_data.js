import sql from 'mssql';
import config from '../../config/index.js';

const DB_CONFIG = {
	server: config.database.server,
	database: config.database.database,
	user: config.database.user,
	password: config.database.password,
	port: config.database.port,
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
};

async function clearData() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		console.log('Clearing database tables...');
		
		await pool.request().query('DELETE FROM dbo.rejected_video_requests');
		await pool.request().query('DELETE FROM dbo.video_editing_pending');
		await pool.request().query('DELETE FROM dbo.video_editing_completed');
		await pool.request().query('DELETE FROM dbo.video_posting_pending');
		await pool.request().query('DELETE FROM dbo.video_posting_completed');
		await pool.request().query('DELETE FROM dbo.video_requests_pending');
		await pool.request().query('DELETE FROM dbo.video_requests_completed');
		await pool.request().query('DELETE FROM dbo.job_cards');
		await pool.request().query('DELETE FROM dbo.customers');
		
		await pool.request().query('UPDATE dbo.users SET branchId = NULL');
		
		await pool.request().query('DELETE FROM dbo.branches');
		
		try {
			await pool.request().query('DBCC CHECKIDENT (\'dbo.branches\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.customers\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.job_cards\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.video_requests_pending\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.video_requests_completed\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.video_editing_pending\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.video_editing_completed\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.video_posting_pending\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.video_posting_completed\', RESEED, 0)');
			await pool.request().query('DBCC CHECKIDENT (\'dbo.rejected_video_requests\', RESEED, 0)');
		} catch (identErr) {
			console.log('Identity reseed skipped or not applicable:', identErr.message);
		}

		console.log('Successfully cleared all records from the database!');
		await pool.close();
	} catch (e) {
		console.error('Error clearing data:', e);
	}
}

clearData();
