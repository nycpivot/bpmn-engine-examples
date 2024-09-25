const Engine = require('bpmn-engine');
const path = require('path')
const fs = require('node:fs');

async function getRequest(scope, callback) {
	console.log(scope);
	console.log(callback);
	try {
		var result = fs.readFileSync(path.resolve(__dirname, './risks.json'))
	} catch (err) {
		return callback(null, err);
	}

	return callback(null, result);
}

const engine = new Engine({
	name: 'service-task',
	source: fs.readFileSync(path.resolve(__dirname, './service.bpmn')),
	//moddleOptions: {
	//	camunda,
	//},
	extensions: {
		saveToResultVariable(activity) {
			if (!activity.behaviour.resultVariable) return;

			            activity.on('end', ({ environment, content }) => {
					            environment.output[activity.behaviour.resultVariable] = content.output[0];
					          });
			          },
		    },
});

function readfile() {
	console.log("reading...");
}

engine.execute(
	  {
		      variables: {
			            apiPath: 'https://example.com/test',
			          },
		      services: {
			      read: readfile,
			          },
		    },
	  (err, execution) => {
		      if (err) throw err;

		      console.log('Service task output:', execution.environment.output.serviceResult);
		    }
);


