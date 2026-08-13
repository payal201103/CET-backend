import fs from 'fs';
import https from 'https';
import path from 'path';

const logoUrl = 'https://i.ibb.co/pr9MxzX4/Whats-App-Image-2026-08-09-at-5-26-25-PM.jpg';
const destPath = 'D:\\Projects\\crm-admin-panel\\src\\assets\\logo.png';

console.log('Starting logo download...');
const file = fs.createWriteStream(destPath);

https.get(logoUrl, (response) => {
	if (response.statusCode !== 200) {
		console.error(`Failed to download logo. Status code: ${response.statusCode}`);
		return;
	}
	response.pipe(file);
	file.on('finish', () => {
		file.close();
		console.log('New logo downloaded and saved successfully to: ' + destPath);
	});
}).on('error', (err) => {
	fs.unlink(destPath, () => {});
	console.error('Error during download:', err.message);
});
