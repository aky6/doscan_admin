import openSocket from 'socket.io-client';
const  socket = openSocket('ws://localhost:5000');
function subscribeToTimer(cb) {
  socket.on('testerEvent', timestamp => cb(null, timestamp));
  console.log("socket",socket);
  socket.emit('testerEvent', 1000);
}
export { subscribeToTimer };