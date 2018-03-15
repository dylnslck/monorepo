const grpc = require('grpc');
const path = require('path');

const PROTO_PATH = `${__dirname}/../../protos/helloworld.proto`;
const {helloworld} = grpc.load(PROTO_PATH);

function sayHello(call, callback) {
  const {request: {name}} = call;

  callback(null, {message: `Hello ${name}`});
}

function main() {
  const server = new grpc.Server();
  server.addService(helloworld.Greeter.service, {sayHello});
  server.bind('0.0.0.0:3001', grpc.ServerCredentials.createInsecure());
  server.start();
}

module.exports = main;
