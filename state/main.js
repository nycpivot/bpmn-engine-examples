const randomUUID = require('node:crypto');
const createRequire = require('node:module');
const fileURLToPath = require('node:url');

const Engine = require('bpmn-engine');
const EventEmitter = require('node:events');
const publish = require('./dbbroker.js');
const getSourceSync = require('./utils.js');
const getAllowedServices = require('./utils.js');
const getExtensions = require('./utils.js');

const camundaModdle = createRequire('file:///home/azureuser/bpmn-examples/state/camunda.json')

function ignite(executionId, options = {}) {
	  const { name, settings } = options;
	  const listener = new EventEmitter();
	  listener.on('activity.wait', (_, execution) => {
		      return publishEvent('bpmn.state.update', {state: execution.getState()});
		    });
	  listener.on('activity.end', (_, execution) => {
		      return publishEvent('bpmn.state.update', {state: execution.getState()});
		    });
	  listener.on('activity.timer', (api, execution) => {
		      return publishEvent('bpmn.state.expires', {
			            expires: new Date(api.content.startedAt + api.content.timeout),
			            state: execution.getState(),
			          });
		    });
	  listener.on('activity.timeout', (_, execution) => {
		      return publishEvent('bpmn.state.expired', {
			            expired: new Date(),
			            state: execution.getState(),
			          });
		    });

	  const engine = BpmnEngine({
		      moddleOptions: {
			            camunda,
			          },
		      ...options,
		      settings: {
			            ...settings,
			            executionId,
			            enableDummyService: false,
			          }
		    });
	  engine.once('end', () => {
		      publishEvent('bpmn.completed');
		    });
	  engine.once('error', (err) => {
		      publishEvent('bpmn.error', {message: err.message, error: err});
		    });

	  return { engine, listener };

	  function publishEvent(routingKey, message) {
		      publish('events', routingKey, {
			            name,
			            executionId,
			            ...message,
			          });
		    }
}

const {engine} = ignite(randomUUID(), {
	  name: 'persisted engine #1',
	  source: getSourceSync('./listener.bpmn'),
	  services: getAllowedServices(),
	  extensions: getExtensions(),
});

engine.execute();

