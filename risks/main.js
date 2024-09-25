const EventEmitter = require('node:events');
const Engine = require('bpmn-engine');

const fs = require('node:fs');

const path = require('path')
const fsPromises = require('fs/promises')

const filePath = path.resolve(__dirname, './risks.json')

const main = async () => {

	const engine = new Engine({
		  name: 'listen example',
		  source: fs.readFileSync(path.resolve(__dirname, './risks.bpmn'))
	});
	
	try {
		const data = await fsPromises.readFile(filePath);
		console.log(data);

		const obj = JSON.parse(data);
		console.log(obj);
	} catch (err) {
		console.log(err);
	}
}

main();

