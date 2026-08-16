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

async function linkSuperAdminMobile() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		await pool.request().query("UPDATE dbo.users SET mobileNo = '8980063095' WHERE userID = 1");
		console.log('Super Admin mobile number updated to 8980063095 in live database!');
		await pool.close();
	} catch (e) {
		console.error(e);
	}
}

linkSuperAdminMobile();
