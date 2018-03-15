const express = require('express');
const bodyParser = require('body-parser');
const grpc = require('grpc');
const Database = require('db');

const PROTO_PATH = `${__dirname}/../../protos/helloworld.proto`;
const {helloworld} = grpc.load(PROTO_PATH);

class Server {
  constructor() {
    this.grpcClient = new helloworld.Greeter(
      'localhost:3001',
      grpc.credentials.createInsecure()
    );
  }

  start(port) {
    const app = express();
    const db = new Database();

    app.use(bodyParser.json());

    app.route('/')
      .get((req, res) => {
        try {
          const records = db.all();
          res.json(records);
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
      })
      .post((req, res) => {
        try {
          const record = db.create(req.body);
          res.json(record);
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
      });

    app.route('/:id')
      .get((req, res) => {
        const {id} = req.params;

        try {
          const record = db.get(id);
          res.json(record);
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
      })
      .put((req, res) => {
        const {id} = req.params;

        try {
          const record = db.update(id, req.body);
          res.json(record);
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
      });

    app.route('/service/:name')
      .get((req, res) => {
        const {name} = req.params;

        this.grpcClient.sayHello({name}, (err, response) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }

          res.send(response);
        });
      });

    return new Promise((resolve, reject) => {
      app.listen(port, (err) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`Server started on port ${port}!`);
        resolve();
      });
    });
  }
}

module.exports = Server;
