import sql from 'mssql';
import bcrypt from 'bcrypt';
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

async function seedData() {
	try {
		const pool = await sql.connect(DB_CONFIG);
		console.log('Connected to SQL Server. Clearing existing table data (excluding super admin)...');

		// 1. Clear existing data
		await pool.request().query('DELETE FROM dbo.rejected_video_requests');
		await pool.request().query('DELETE FROM dbo.video_editing_pending');
		await pool.request().query('DELETE FROM dbo.video_editing_completed');
		await pool.request().query('DELETE FROM dbo.video_posting_pending');
		await pool.request().query('DELETE FROM dbo.video_posting_completed');
		await pool.request().query('DELETE FROM dbo.video_requests_pending');
		await pool.request().query('DELETE FROM dbo.video_requests_completed');
		await pool.request().query('DELETE FROM dbo.job_cards');
		await pool.request().query('DELETE FROM dbo.customers');
		await pool.request().query('DELETE FROM dbo.car_models');
		await pool.request().query('DELETE FROM dbo.car_brands');
		await pool.request().query("DELETE FROM dbo.users WHERE username <> 'admin'");
		await pool.request().query('DELETE FROM dbo.branches');

		// Reseed Identity counters
		const tablesToReseed = [
			'branches', 'customers', 'job_cards', 'car_brands', 'car_models',
			'video_requests_pending',
			'video_editing_pending',
			'video_posting_pending',
			'rejected_video_requests'
		];
		for (const t of tablesToReseed) {
			try {
				await pool.request().query(`DBCC CHECKIDENT ('dbo.${t}', RESEED, 0)`);
			} catch (reseedErr) {
				// Ignore tables that don't support CHECKIDENT
			}
		}

		console.log('Database cleared and identities reset.');

		// 2. Fetch admin userID
		const adminRes = await pool.request().query("SELECT userID FROM dbo.users WHERE username = 'admin'");
		const adminId = adminRes.recordset[0]?.userID || 1;

		// 3. Create branch "exotic" in Ahmedabad
		const branchInsert = await pool.request().query(`
			INSERT INTO dbo.branches (branchName, city, isActive, createdAt, updatedAt)
			VALUES ('exotic', 'Ahmedabad', 1, GETDATE(), GETDATE());
			SELECT SCOPE_IDENTITY() as id;
		`);
		const branchId = branchInsert.recordset[0].id;
		console.log(`Created branch 'exotic' with ID: ${branchId}`);

		// 4. Create Users (bcrypt password '123456')
		const passwordHash = await bcrypt.hash('123456', 10);
		const usersToSeed = [
			{ username: 'amit_admin', role: 'Admin', first: 'Amit', last: 'Shah', mobile: '9876543211' },
			{ username: 'jignesh_video', role: 'Videographer', first: 'Jignesh', last: 'Patel', mobile: '9876543212' },
			{ username: 'rohit_video', role: 'Videographer', first: 'Rohit', last: 'Sharma', mobile: '9876543213' },
			{ username: 'dhaval_editor', role: 'Video Editor', first: 'Dhaval', last: 'Bhai', mobile: '9876543214' },
			{ username: 'hardik_editor', role: 'Video Editor', first: 'Hardik', last: 'Pandya', mobile: '9876543215' },
			{ username: 'karan_poster', role: 'Social Media Poster', first: 'Karan', last: 'Johar', mobile: '9876543216' },
		];

		const userIds = {};
		for (const u of usersToSeed) {
			const uInsert = await pool.request().query(`
				INSERT INTO dbo.users (username, password, role, Firstname, Lastname, createdBy, branchId, createdAt, updatedAt, mobileNo)
				VALUES ('${u.username}', '${passwordHash}', '${u.role}', '${u.first}', '${u.last}', ${adminId}, ${branchId}, GETDATE(), GETDATE(), '${u.mobile}');
				SELECT SCOPE_IDENTITY() as id;
			`);
			userIds[u.username] = uInsert.recordset[0].id;
			console.log(`Created user '${u.username}' (ID: ${userIds[u.username]})`);
		}

		// 5. Seed Car Brands
		const brands = ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Jaguar', 'Land Rover'];
		const brandIds = {};
		for (const b of brands) {
			const bInsert = await pool.request().query(`
				INSERT INTO dbo.car_brands (name, createdBy, createdAt)
				VALUES ('${b}', ${adminId}, GETDATE());
				SELECT SCOPE_IDENTITY() as id;
			`);
			brandIds[b] = bInsert.recordset[0].id;
			console.log(`Created Brand '${b}' (ID: ${brandIds[b]})`);
		}

		// 6. Seed Car Models
		const models = [
			{ brand: 'Audi', name: 'A6' },
			{ brand: 'Audi', name: 'Q7' },
			{ brand: 'Audi', name: 'e-tron' },
			{ brand: 'BMW', name: 'X5' },
			{ brand: 'BMW', name: '5 Series' },
			{ brand: 'BMW', name: 'i7' },
			{ brand: 'Mercedes-Benz', name: 'C-Class' },
			{ brand: 'Mercedes-Benz', name: 'GLE' },
			{ brand: 'Mercedes-Benz', name: 'S-Class' },
			{ brand: 'Porsche', name: '911' },
			{ brand: 'Porsche', name: 'Cayenne' },
			{ brand: 'Porsche', name: 'Taycan' },
			{ brand: 'Jaguar', name: 'F-TYPE' },
			{ brand: 'Jaguar', name: 'XF' },
			{ brand: 'Land Rover', name: 'Defender' },
			{ brand: 'Land Rover', name: 'Range Rover Sport' },
		];
		const modelIds = {};
		for (const m of models) {
			const bId = brandIds[m.brand];
			const mInsert = await pool.request().query(`
				INSERT INTO dbo.car_models (brandId, name, createdBy, createdAt)
				VALUES (${bId}, '${m.name}', ${adminId}, GETDATE());
				SELECT SCOPE_IDENTITY() as id;
			`);
			modelIds[`${m.brand}_${m.name}`] = mInsert.recordset[0].id;
			console.log(`Created Model '${m.brand} ${m.name}' (ID: ${modelIds[`${m.brand}_${m.name}`]})`);
		}

		// 7. Seed Customers (12 customers for pagination)
		const customers = [
			{ name: 'Arjun Mehta', mobile: '9876543210', email: 'arjun.mehta@gmail.com', gst: '24AAAAM1234A1Z1' },
			{ name: 'Payal Patel', mobile: '9898989898', email: 'payal.patel@yahoo.com', gst: null },
			{ name: 'Jignesh Shah', mobile: '9909099090', email: 'jignesh.shah@outlook.com', gst: null },
			{ name: 'Dhaval Sharma', mobile: '9123456789', email: 'dhaval.sharma@gmail.com', gst: null },
			{ name: 'Hardik Pandya', mobile: '9800000001', email: 'hardik@gmail.com', gst: null },
			{ name: 'Shubman Gill', mobile: '9800000002', email: 'shubman@gmail.com', gst: null },
			{ name: 'Virat Kohli', mobile: '9800000003', email: 'virat@gmail.com', gst: null },
			{ name: 'Rohit Sharma', mobile: '9800000004', email: 'rohit@gmail.com', gst: null },
			{ name: 'KL Rahul', mobile: '9800000005', email: 'klrahul@gmail.com', gst: null },
			{ name: 'Rishabh Pant', mobile: '9800000006', email: 'pant@gmail.com', gst: null },
			{ name: 'Jasprit Bumrah', mobile: '9800000007', email: 'bumrah@gmail.com', gst: null },
			{ name: 'Ravindra Jadeja', mobile: '9800000008', email: 'jadeja@gmail.com', gst: null },
		];
		const customerIds = {};
		for (const c of customers) {
			const emailVal = c.email ? `'${c.email}'` : 'NULL';
			const gstVal = c.gst ? `'${c.gst}'` : 'NULL';
			const cInsert = await pool.request().query(`
				INSERT INTO dbo.customers (name, mobile, email, gstNumber, createdBy, createdAt)
				VALUES ('${c.name}', '${c.mobile}', ${emailVal}, ${gstVal}, ${adminId}, GETDATE());
				SELECT SCOPE_IDENTITY() as id;
			`);
			customerIds[c.name] = cInsert.recordset[0].id;
			console.log(`Created Customer '${c.name}' (ID: ${customerIds[c.name]})`);
		}

		// 8. Seed Job Cards (12 records for pagination)
		const jobCards = [
			{ no: 'JC-2026-001', customer: 'Arjun Mehta', brand: 'BMW', model: 'X5', num: 'GJ01AB1234', color: 'Black', services: ['Car Wash', 'PPF (Paint Protection Film)'], status: 'Pending', notes: 'Urgent delivery requested.' },
			{ no: 'JC-2026-002', customer: 'Payal Patel', brand: 'Audi', model: 'A6', num: 'GJ01CD5678', color: 'White', services: ['Ceramic Coating'], status: 'Completed', notes: 'Deliver after interior cleanup.' },
			{ no: 'JC-2026-003', customer: 'Jignesh Shah', brand: 'Porsche', model: '911', num: 'GJ01EF9012', color: 'Red', services: ['Graphene Coating'], status: 'Recording', notes: 'Check rear wing PPF.' },
			{ no: 'JC-2026-004', customer: 'Dhaval Sharma', brand: 'Land Rover', model: 'Defender', num: 'GJ01GH3456', color: 'Grey', services: ['Paint Denting'], status: 'Editing', notes: 'Remove scratches on front bumper.' },
			{ no: 'JC-2026-005', customer: 'Hardik Pandya', brand: 'Mercedes-Benz', model: 'GLE', num: 'GJ01JK7890', color: 'Blue', services: ['PPF (Paint Protection Film)'], status: 'Ready', notes: 'Film application on side doors.' },
			{ no: 'JC-2026-006', customer: 'Shubman Gill', brand: 'Jaguar', model: 'F-TYPE', num: 'GJ01LM1234', color: 'Black', services: ['Foam Wash'], status: 'Rejected', notes: 'Interior leather conditioning.' },
			{ no: 'JC-2026-007', customer: 'Virat Kohli', brand: 'Audi', model: 'e-tron', num: 'GJ01NP5678', color: 'Red', services: ['Ceramic Coating'], status: 'Completed', notes: 'Charge battery to 100%.' },
			{ no: 'JC-2026-008', customer: 'Rohit Sharma', brand: 'BMW', model: 'i7', num: 'GJ01RS9012', color: 'White', services: ['PPF (Paint Protection Film)'], status: 'Completed', notes: 'Double coat polish.' },
			{ no: 'JC-2026-009', customer: 'KL Rahul', brand: 'Porsche', model: 'Taycan', num: 'GJ01TV3456', color: 'Grey', services: ['Graphene Coating'], status: 'Completed', notes: 'Alloy wheels cleanup.' },
			{ no: 'JC-2026-010', customer: 'Rishabh Pant', brand: 'Mercedes-Benz', model: 'S-Class', num: 'GJ01WX7890', color: 'Black', services: ['Paint Correction'], status: 'Completed', notes: 'Polish rear bumper.' },
			{ no: 'JC-2026-011', customer: 'Jasprit Bumrah', brand: 'Land Rover', model: 'Range Rover Sport', num: 'GJ01YZ1234', color: 'White', services: ['Accessories'], status: 'Pending', notes: 'Install dashboard camera.' },
			{ no: 'JC-2026-012', customer: 'Ravindra Jadeja', brand: 'Jaguar', model: 'XF', num: 'GJ01ZA5678', color: 'Green', services: ['Paint Denting'], status: 'Pending', notes: 'Remove small dent on right fender.' },
		];

		for (const jc of jobCards) {
			const cId = customerIds[jc.customer];
			const bId = brandIds[jc.brand];
			const mId = modelIds[`${jc.brand}_${jc.model}`];
			const servicesStr = jc.services.join(',');

			await pool.request().query(`
				INSERT INTO dbo.job_cards (
					jobCardNo, customerId, brandId, modelId, carNumber, carColor, 
					services, bookingDate, deliveryDate, specialNotes, status, 
					isCompleted, createdBy, createdAt, updatedAt, branchId
				) VALUES (
					'${jc.no}', ${cId}, ${bId}, ${mId}, '${jc.num}', '${jc.color}',
					'${servicesStr}', DATEADD(day, -2, GETDATE()), DATEADD(day, 2, GETDATE()), '${jc.notes}', '${jc.status}',
					${jc.status === 'Completed' ? 1 : 0}, ${adminId}, GETDATE(), GETDATE(), ${branchId}
				);
			`);
			console.log(`Created Job Card '${jc.no}'`);
		}

		// 9. Seed Video Requests (Pending & Completed)
		// Pending video requests:
		const videoReqsPending = [
			{ jc: 'JC-2026-001', type: 'Car Reveal', status: 'Pending', assignedBy: 'Amit Shah' },
			{ jc: 'JC-2026-003', type: 'PPF Installation', status: 'In Progress', assignedBy: 'Amit Shah' },
			{ jc: 'JC-2026-011', type: 'Detailing Process', status: 'Pending', assignedBy: 'Amit Shah' },
			{ jc: 'JC-2026-012', type: 'Car Wash Process', status: 'Pending', assignedBy: 'Amit Shah' },
		];
		for (const vr of videoReqsPending) {
			await pool.request().query(`
				INSERT INTO dbo.video_requests_pending (jobCardNo, customerName, videoType, status, assignedBy, date, isActive, createdAt, updatedAt)
				VALUES ('${vr.jc}', 'Seeded Customer', '${vr.type}', '${vr.status}', '${vr.assignedBy}', GETDATE(), 1, GETDATE(), GETDATE());
			`);
		}
		// Completed video requests:
		const videoReqsCompleted = [
			{ jc: 'JC-2026-002', type: 'Ceramic Coating Reveal', status: 'Completed', assignedBy: 'Amit Shah' },
			{ jc: 'JC-2026-007', type: 'e-tron Delivery', status: 'Completed', assignedBy: 'Amit Shah' },
			{ jc: 'JC-2026-008', type: 'i7 Gloss Reveal', status: 'Completed', assignedBy: 'Amit Shah' },
			{ jc: 'JC-2026-009', type: 'Taycan Detailing', status: 'Completed', assignedBy: 'Amit Shah' },
		];
		let vrCompId = 1;
		for (const vr of videoReqsCompleted) {
			await pool.request().query(`
				INSERT INTO dbo.video_requests_completed (id, jobCardNo, customerName, videoType, status, assignedBy, date, completedDate, isActive, createdAt, updatedAt)
				VALUES (${vrCompId++}, '${vr.jc}', 'Seeded Customer', '${vr.type}', '${vr.status}', '${vr.assignedBy}', DATEADD(day, -2, GETDATE()), GETDATE(), 1, GETDATE(), GETDATE());
			`);
		}

		// 10. Seed Video Editing (Pending & Completed)
		const videoEditingPending = [
			{ jc: 'JC-2026-004', car: 'Defender grey', type: 'Denting Work', status: 'Pending', videographer: 'Jignesh Patel', editor: 'Dhaval Bhai' },
			{ jc: 'JC-2026-005', car: 'GLE Blue', type: 'PPF Gloss Installation', status: 'In Editing', videographer: 'Rohit Sharma', editor: 'Hardik Pandya' },
		];
		for (const ve of videoEditingPending) {
			await pool.request().query(`
				INSERT INTO dbo.video_editing_pending (jobCardNo, customerName, carDetails, videoType, status, videographer, editor, dueDate, isActive, createdAt, updatedAt)
				VALUES ('${ve.jc}', 'Seeded Customer', '${ve.car}', '${ve.type}', '${ve.status}', '${ve.videographer}', '${ve.editor}', DATEADD(day, 2, GETDATE()), 1, GETDATE(), GETDATE());
			`);
		}
		const videoEditingCompleted = [
			{ jc: 'JC-2026-008', car: 'BMW i7 White', type: 'PPF Gloss Reveal', status: 'Completed', videographer: 'Jignesh Patel', editor: 'Dhaval Bhai' },
			{ jc: 'JC-2026-010', car: 'S-Class Black', type: 'Paint Polish Reveal', status: 'Completed', videographer: 'Rohit Sharma', editor: 'Hardik Pandya' },
		];
		let veCompId = 1;
		for (const ve of videoEditingCompleted) {
			await pool.request().query(`
				INSERT INTO dbo.video_editing_completed (id, jobCardNo, customerName, carDetails, videoType, status, videographer, editor, dueDate, completedDate, isActive, createdAt, updatedAt)
				VALUES (${veCompId++}, '${ve.jc}', 'Seeded Customer', '${ve.car}', '${ve.type}', '${ve.status}', '${ve.videographer}', '${ve.editor}', DATEADD(day, -1, GETDATE()), GETDATE(), 1, GETDATE(), GETDATE());
			`);
		}

		// 11. Seed Video Posting (Pending & Completed)
		const videoPostingPending = [
			{ jc: 'JC-2026-002', car: 'Audi A6 White', type: 'Ceramic Coating Reveal', status: 'Pending Upload', videographer: 'Jignesh Patel' },
			{ jc: 'JC-2026-009', car: 'Porsche Taycan Grey', type: 'Graphene Coating', status: 'Drafting Caption', videographer: 'Rohit Sharma' },
		];
		for (const vp of videoPostingPending) {
			await pool.request().query(`
				INSERT INTO dbo.video_posting_pending (jobCardNo, customerName, carDetails, videoType, status, videographer, dueDate, isActive, createdAt, updatedAt)
				VALUES ('${vp.jc}', 'Seeded Customer', '${vp.car}', '${vp.type}', '${vp.status}', '${vp.videographer}', DATEADD(day, 1, GETDATE()), 1, GETDATE(), GETDATE());
			`);
		}
		const videoPostingCompleted = [
			{ jc: 'JC-2026-008', car: 'BMW i7 White', type: 'PPF Gloss Reveal', status: 'Posted', videographer: 'Jignesh Patel' },
		];
		let vpCompId = 1;
		for (const vp of videoPostingCompleted) {
			await pool.request().query(`
				INSERT INTO dbo.video_posting_completed (id, jobCardNo, customerName, carDetails, videoType, status, videographer, dueDate, completedDate, isActive, createdAt, updatedAt)
				VALUES (${vpCompId++}, '${vp.jc}', 'Seeded Customer', '${vp.car}', '${vp.type}', '${vp.status}', '${vp.videographer}', DATEADD(day, -1, GETDATE()), GETDATE(), 1, GETDATE(), GETDATE());
			`);
		}

		// 12. Seed Rejected Video Requests
		const rejectedVideoReqs = [
			{ jc: 'JC-2026-006', car: 'Jaguar F-TYPE Black', services: 'Foam Wash', videographer: 'Jignesh Patel', reason: 'Poor lighting in wash bay' },
		];
		for (const r of rejectedVideoReqs) {
			await pool.request().query(`
				INSERT INTO dbo.rejected_video_requests (jobCardNo, customerName, carDetails, services, videographerName, rejectedDate, rejectionReason, isResolved, createdAt, updatedAt)
				VALUES ('${r.jc}', 'Seeded Customer', '${r.car}', '${r.services}', '${r.videographer}', GETDATE(), '${r.reason}', 0, GETDATE(), GETDATE());
			`);
		}

		console.log('Successfully completed live database seeding of all tables!');
		await pool.close();
	} catch (e) {
		console.error('Error running seeding:', e);
	}
}

seedData();
