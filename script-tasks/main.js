const Engine = require('bpmn-engine');
const bent = require('bent');
const path = require('path');
const fs = require('node:fs');
const fsPromises = require('fs/promises')
const EventEmitter = require('node:events');

const filePath = path.resolve(__dirname, './risks.json')

const readline = require('node:readline');
const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
});

const engine = new Engine({
	  name: 'script task example',
	  source: fs.readFileSync(path.resolve(__dirname, './script.bpmn'))
});

const listener = new EventEmitter();

engine.execute({
  variables: {
	scriptTaskCompleted: false,
	input: 0
  },
  services: {
	read: readfile
  },
  listener
});

function readfile() {
	var risks = fs.readFileSync(path.resolve(__dirname, './risks.json'));
	var json = JSON.parse(risks);

	console.log(json);
}

listener.once('wait', (elementApi) => {
	rl.question(`Select Id: `, id => {
		//console.log(elementApi.variables);
		elementApi.signal({
			id: `${id}`
		});
		rl.close();
	});
});

listener.on('activity.end', (elementApi, engineApi) => {
	if (elementApi.content.output) {
		var risks = fs.readFileSync(path.resolve(__dirname, './risks.json'));
		var json = JSON.parse(risks);
		var id = elementApi.content.output.id - 1;

		console.log(json[id]["name"]);
	}
});

