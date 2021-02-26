const ws = require('ws');

const client = new ws('ws://localhost:4000/sensor-data');


client.on('open', () => {
  // Causes the server to print "Hello"
  console.log("Start!");
  client.send('Hello');
});