import jwt from 'jsonwebtoken';
import sql from 'mssql';
import config from '../src/config/index.js';

const dbConfig = {
	server: config.database.server,
	database: config.database.database,
	user: config.database.user,
	password: config.database.password,
	port: config.database.port,
	options: {
		encrypt: config.database.encrypt,
		trustServerCertificate: config.database.trustServerCertificate,
	},
};

async function generateToken() {
	const args = process.argv.slice(2);
	const userName = args[0] || 'admin';
	const role = args[1] || 'DEO';
	const rawPassword = args[2] || 'admin@123';
	const firstName = args[3] || 'John';
	const lastName = args[4] || 'Doe';

	try {
		console.log(
			`Connecting to database at ${dbConfig.server}:${dbConfig.port} (DB: ${dbConfig.database})...`
		);
		let pool = await sql.connect(dbConfig);

		console.log(`Checking if user '${userName}' exists in CRM 'users' table...`);
		const userCheck = await pool
			.request()
			.input('userName', sql.VarChar(100), userName)
			.query(`SELECT userID FROM users WHERE username = @userName`);

		let userId;
		if (userCheck.recordset.length === 0) {
			console.log(`Creating user '${userName}' in users table...`);
			const insertUser = await pool
				.request()
				.input('userName', sql.VarChar(100), userName)
				.input('password', sql.VarChar(255), rawPassword)
				.input('role', sql.VarChar(50), role)
				.input('firstName', sql.VarChar(100), firstName)
				.input('lastName', sql.VarChar(100), lastName).query(`
					INSERT INTO users (username, password, role, Firstname, Lastname)
					VALUES (@userName, @password, @role, @firstName, @lastName);
					SELECT SCOPE_IDENTITY() as id;
				`);
			userId = insertUser.recordset[0].id;
		} else {
			userId = userCheck.recordset[0].userID;
		}

		console.log(`User ID is: ${userId}`);

		const token = jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

		console.log('Registering active session in session_master...');
		await pool.request().input('userId', sql.Int, userId).input('token', sql.VarChar(512), token)
			.query(`
				INSERT INTO session_master (userId, token, createdAt, updatedAt, ipAddress)
				VALUES (@userId, @token, GETDATE(), GETDATE(), '127.0.0.1');
			`);

		console.log(
			'\n=========================================================================================='
		);
		console.log(
			`TOKEN GENERATED SUCCESSFULLY FOR USER: ${userName} (Role: ${role}, UserID: ${userId})`
		);
		console.log(
			'=========================================================================================='
		);
		console.log(token);
		console.log(
			'==========================================================================================\n'
		);

		await sql.close();
	} catch (err) {
		console.error('Error generating token:', err);
	}
}

generateToken();
