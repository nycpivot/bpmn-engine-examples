const EventEmitter = require('node:events');
const Engine = require('bpmn-engine');
const path = require('path')
const fs = require('node:fs');

const engine = new Engine({
  name: 'listener',
  source: fs.readFileSync(path.resolve(__dirname, './listener.bpmn'))
});

const listener = new EventEmitter();

listener.once('wait', (task) => {
	  task.signal({
		      ioSpecification: {
			            dataOutputs: [
					            {
							              id: 'userInput',
							              value: 'von Rosen',
							            },
					          ],
			          },
		    });
});

listener.once('readfile', (task) => {
	console.log("Yeah");
});

listener.on('flow.take', (flow) => {
	  console.log(`flow <${flow.id}> was taken`);
});

engine.once('end', (execution) => {
	  console.log(execution.environment.variables);
	  console.log(`User sirname is ${execution.environment.output.data.inputFromUser}`);
});

engine.execute(
	  {
		      listener,
		    },
	  (err) => {
		      if (err) throw err;
		    }
);

