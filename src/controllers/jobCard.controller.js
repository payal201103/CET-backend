import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JobCardService from '../services/jobCard.service.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobCardService = new JobCardService();

class JobCardController {
	async getAllJobCards(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const jobCards = await jobCardService.getAllJobCards(userId, userRole);
			return res.handler.success(jobCards, 'Job cards fetched successfully');
		} catch (error) {
			logger.error('Error in getAllJobCards controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching job cards');
		}
	}

	async createJobCard(req, res) {
		try {
			const createdBy = req.user?.userId;
			const newJobCard = await jobCardService.createJobCard(req.body, createdBy);
			return res.handler.success(newJobCard, 'Job card created successfully');
		} catch (error) {
			logger.error('Error in createJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error creating job card');
		}
	}

	async updateJobCard(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Job Card ID is required');
			}

			const updatedJobCard = await jobCardService.updateJobCard(id, req.body, userId, userRole);
			return res.handler.success(updatedJobCard, 'Job card updated successfully');
		} catch (error) {
			logger.error('Error in updateJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating job card');
		}
	}

	async deleteJobCard(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Job Card ID is required');
			}

			await jobCardService.deleteJobCard(id, userId, userRole);
			return res.handler.success({}, 'Job card deleted successfully');
		} catch (error) {
			logger.error('Error in deleteJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error deleting job card');
		}
	}

	async completeJobCard(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Job Card ID is required');
			}

			const result = await jobCardService.completeJobCard(id, userId, userRole);
			return res.handler.success(result, 'Job card marked as completed');
		} catch (error) {
			logger.error('Error in completeJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error completing job card');
		}
	}

	async getJobCardPdf(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.status(400).send('Job Card ID is required');
			}

			const jobCard = await jobCardService.getJobCardById(id, userId, userRole);
			if (!jobCard) {
				return res.status(404).send('Job card not found');
			}

			// Read logo and convert to base64
			let logoBase64 = '';
			try {
				const logoPath = 'D:\\Projects\\crm-admin-panel\\src\\assets\\logo.png';
				if (fs.existsSync(logoPath)) {
					const logoBuffer = fs.readFileSync(logoPath);
					logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
				}
			} catch (e) {
				logger.error('Failed to read logo image for PDF', e);
			}

			const formatDate = (dateStr, includeTime = false) => {
				if (!dateStr) return '—';
				try {
					const date = new Date(dateStr);
					if (isNaN(date.getTime())) return dateStr;
					const options = {
						day: '2-digit',
						month: 'short',
						year: 'numeric'
					};
					if (includeTime) {
						options.hour = '2-digit';
						options.minute = '2-digit';
						options.hour12 = true;
					}
					return date.toLocaleDateString('en-GB', options).replace(/,/g, '');
				} catch (e) {
					return dateStr;
				}
			};

			const htmlContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Job Card - ${jobCard.jobCardNo}</title>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
		body {
			font-family: 'Outfit', sans-serif;
			margin: 0;
			padding: 40px;
			color: #171717;
			background-color: #ffffff;
		}
		.container {
			max-width: 700px;
			margin: 0 auto;
			background-color: #ffffff;
		}
		.header-logo {
			text-align: center;
			margin-bottom: 5px;
		}
		.header-logo img {
			height: 100px;
			object-fit: contain;
		}
		.subtitle {
			text-align: center;
			font-size: 11px;
			text-transform: uppercase;
			letter-spacing: 2px;
			color: #71717A;
			margin-top: 5px;
			margin-bottom: 2px;
			font-weight: 600;
		}
		.title-studio {
			text-align: center;
			font-size: 20px;
			font-weight: 700;
			letter-spacing: 1px;
			color: #171717;
			margin: 0 0 15px 0;
		}
		.divider-container {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 15px 0;
		}
		.divider-line {
			flex: 1;
			height: 1px;
			background-color: #d4af37;
			opacity: 0.6;
		}
		.divider-ornament {
			margin: 0 15px;
			color: #d4af37;
			font-size: 14px;
			letter-spacing: 2px;
		}
		.main-title {
			text-align: center;
			font-size: 38px;
			font-weight: 700;
			color: #9C7A1E;
			margin: 10px 0;
			letter-spacing: 1.5px;
		}
		.jobcard-number-box {
			display: flex;
			justify-content: center;
			margin-bottom: 30px;
		}
		.jobcard-number-inner {
			border: 2px solid #C9A227;
			border-radius: 12px;
			padding: 6px 20px;
			font-size: 20px;
			font-weight: 700;
			color: #9C7A1E;
			background-color: #ffffff;
		}
		.details-table {
			width: 100%;
			border-collapse: collapse;
			margin-bottom: 30px;
		}
		.details-table td {
			padding: 12px 10px;
			font-size: 15px;
			vertical-align: middle;
		}
		.label {
			font-weight: 700;
			color: #171717;
			width: 40%;
			text-align: left;
		}
		.value {
			font-weight: 700;
			color: #9C7A1E;
			width: 60%;
			text-align: left;
			font-size: 16px;
		}
		.service-banner {
			background: linear-gradient(135deg, #C9A227, #9C7A1E);
			border-radius: 12px;
			padding: 14px 20px;
			color: #ffffff;
			font-size: 16px;
			font-weight: 700;
			display: flex;
			align-items: center;
			margin-bottom: 30px;
			box-shadow: 0 4px 10px rgba(201, 162, 39, 0.15);
		}
		.service-icon {
			margin-right: 12px;
			display: flex;
			align-items: center;
		}
		.note-section {
			margin-top: 20px;
			padding: 0 10px;
		}
		.note-title {
			font-size: 16px;
			font-weight: 700;
			color: #171717;
			margin-bottom: 8px;
		}
		.note-content {
			font-size: 15px;
			font-weight: 700;
			color: #9C7A1E;
			line-height: 1.4;
		}
		.footer-ornament {
			text-align: center;
			margin-top: 50px;
			color: #C9A227;
			opacity: 0.6;
			font-size: 18px;
		}
		@media print {
			body {
				padding: 20px;
			}
			.service-banner {
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
				background: linear-gradient(135deg, #C9A227, #9C7A1E) !important;
				color: #ffffff !important;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header-logo">
			\${logoBase64 ? \`<img src="\${logoBase64}" alt="Exotic Car Logo">\` : ''}
		</div>
		<div class="subtitle">We Detail With Passion</div>
		<h2 class="title-studio">EXOTIC CAR DETAILING STUDIO</h2>
		
		<div class="divider-container">
			<div class="divider-line"></div>
			<div class="divider-ornament">❃❃❃</div>
			<div class="divider-line"></div>
		</div>

		<div class="main-title">JOB CARD</div>
		
		<div class="jobcard-number-box">
			<div class="jobcard-number-inner">
				Job Card No: \${jobCard.jobCardNo}
			</div>
		</div>

		<table class="details-table">
			<tr>
				<td class="label">Customer Name:</td>
				<td class="value">\${jobCard.customer}</td>
			</tr>
			<tr>
				<td class="label">Mobile No:</td>
				<td class="value">\${jobCard.phone}</td>
			</tr>
			<tr>
				<td class="label">Car Brand:</td>
				<td class="value">\${jobCard.carBrand || '—'}</td>
			</tr>
			<tr>
				<td class="label">Car Model:</td>
				<td class="value">\${jobCard.carModel || '—'}</td>
			</tr>
			<tr>
				<td class="label">Car Color:</td>
				<td class="value">\${jobCard.carColor || '—'}</td>
			</tr>
			<tr>
				<td class="label">Car Number:</td>
				<td class="value">\${jobCard.carNumber || '—'}</td>
			</tr>
			<tr>
				<td class="label">Booking Date:</td>
				<td class="value">\${formatDate(jobCard.bookingDate, true)}</td>
			</tr>
			<tr>
				<td class="label">Estimate Delivery Date:</td>
				<td class="value">\${formatDate(jobCard.deliveryDate, false)}</td>
			</tr>
		</table>

		<div class="service-banner">
			<div class="service-icon">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
					<circle cx="7" cy="17" r="2"/>
					<path d="M9 17h6"/>
					<circle cx="17" cy="17" r="2"/>
				</svg>
			</div>
			Service: \${Array.isArray(jobCard.service) ? jobCard.service.join(', ') : (jobCard.service || '—')}
		</div>

		<div class="note-section">
			<div class="note-title">Note/Remark:</div>
			<div class="note-content">\${jobCard.notes || '—'}</div>
		</div>

		<div class="footer-ornament">
			❃❃❃
		</div>
	</div>
	<script>
		window.onload = function() {
			setTimeout(function() {
				window.print();
			}, 500);
		};
	</script>
</body>
</html>
			`;

			res.setHeader('Content-Type', 'text/html');
			return res.send(htmlContent);
		} catch (error) {
			logger.error('Error in getJobCardPdf controller', { error });
			return res.status(500).send('Error generating job card PDF');
		}
	}
}

export default JobCardController;
