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
	},
};

async function addMobileColumn() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		await pool.request().query(`
			IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.users') AND name = 'mobileNo')
			BEGIN
				ALTER TABLE dbo.users ADD mobileNo VARCHAR(15) NULL;
			END
		`);
		console.log('mobileNo column successfully verified on users table!');
		await pool.close();
	} catch (e) {
		console.error('Error adding mobileNo column:', e);
	}
}

addMobileColumn();
