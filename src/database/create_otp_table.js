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

async function createOtpTable() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		await pool.request().query(`
			IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'otp_verifications' AND schema_id = SCHEMA_ID('dbo'))
			BEGIN
				CREATE TABLE dbo.otp_verifications (
					id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
					username VARCHAR(100) NOT NULL,
					otpCode VARCHAR(10) NOT NULL,
					expiresAt DATETIME2(3) NOT NULL,
					isUsed BIT DEFAULT 0,
					createdAt DATETIME2(3) DEFAULT SYSDATETIME()
				);
			END
		`);
		console.log('otp_verifications table verified on live database!');
		await pool.close();
	} catch (e) {
		console.error('Error creating otp_verifications table:', e);
	}
}

createOtpTable();
