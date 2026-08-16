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

async function checkUsers() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		const res = await pool.request().query('SELECT * FROM dbo.users');
		console.log('USERS IN DB:', res.recordset);
		await pool.close();
	} catch (e) {
		console.error(e);
	}
}

checkUsers();
