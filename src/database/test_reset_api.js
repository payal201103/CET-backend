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

async function testResetApi() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		await pool.request().query("UPDATE dbo.users SET role = 'Super Admin' WHERE userID = 1");
		console.log('Role updated to Super Admin in live database!');
		await pool.close();
	} catch (e) {
		console.error(e);
	}
}

testResetApi();
