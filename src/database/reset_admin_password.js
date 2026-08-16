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

async function resetPassword() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		await pool.request().query("UPDATE dbo.users SET password = 'admin123' WHERE LOWER(username) = 'admin'");
		console.log('Admin password successfully set to admin123!');
		await pool.close();
	} catch (e) {
		console.error(e);
	}
}

resetPassword();
