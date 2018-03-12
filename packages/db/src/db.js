const updatePrimitives = require('shared/updatePrimitives');

class Database {
  constructor() {
    this.store = {};
  }

  all() {
    return Object.keys(this.store).map((id) => this.get(id));
  }

  get(id) {
    return this.store[id] || null;
  }

  create(record = {}) {
    const {id} = record;

    if (!id) {
      throw new Error('Record ID is a required attribute');
    }

    this.store[id] = record;
    return this.get(id);
  }

  update(id, attributes = {}) {
    const record = this.store[id];

    if (!record) {
      throw new Error('Record not found');
    }

    updatePrimitives(record, attributes);
    return this.get(id);
  }

  delete(id) {
    this.store[id] && delete this.store[id];
    return true;
  }
}

module.exports = Database;
