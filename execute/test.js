//import { Engine } from 'bpmn-engine';

var Engine = require('bpmn-engine');

const id = Math.floor(Math.random() * 10000);

const source = `
<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <process id="my-process" isExecutable="true">
      <startEvent id="my-start" />
      <exclusiveGateway id="decision" default="flow2" />
      <endEvent id="end1" />
      <endEvent id="end2" />
      <sequenceFlow id="flow1" sourceRef="my-start" targetRef="decision" />
      <sequenceFlow id="flow2" sourceRef="decision" targetRef="end1" />
      <sequenceFlow id="flow3" sourceRef="decision" targetRef="end2">
        <conditionExpression>true</conditionExpression>
      </sequenceFlow>
    </process>
  </definitions>`;

const engine = new Engine({
  name: 'execution example',
  source,
  variables: {
    id,
  },
});

engine.execute((err, execution) => {
	console.log(execution.environment);
	 // console.log('Execution completed with id', execution.environment.variables.id);
});

