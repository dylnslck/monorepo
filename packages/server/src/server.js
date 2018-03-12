const express = require('express');
const bodyParser = require('body-parser');
const Database = require('db');

class Server {
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
