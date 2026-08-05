import fs from 'fs';
import path from 'path';

const searchRoot = 'D:\\Projects';
const foundFiles = [];

function searchDir(dir) {
	try {
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const fullPath = path.join(dir, file);
			let stat;
			try {
				stat = fs.statSync(fullPath);
			} catch (e) {
				continue;
			}
			if (stat.isDirectory()) {
				// Skip node_modules and .git
				if (file !== 'node_modules' && file !== '.git') {
					searchDir(fullPath);
				}
			} else if (file.toLowerCase().endsWith('.sql')) {
				foundFiles.push(fullPath);
			}
		}
	} catch (e) {
		console.error(`Error reading directory ${dir}:`, e.message);
	}
}

searchDir(searchRoot);

foundFiles.forEach(f => {
	const lower = f.toLowerCase();
	if (!lower.includes('cet-backend\\src\\database\\sp\\') && !lower.includes('cet-backend\\src\\database\\tables\\')) {
	
	}
});
