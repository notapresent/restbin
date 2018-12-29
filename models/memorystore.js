const MemoryStore = {
  async open() {
    this._store = {};
    return Promise.resolve();
  },

  async close() {
    this._store = undefined;
    return Promise.resolve();
  },

  async get(key) {
    if (key in this._store) {
      return Promise.resolve(this._store[key]);
    }

    const err = new Error(`Key ${key} not found`);
    err.code = 'notFound';
    return Promise.reject(err);
  },

  async put(key, value) {
    const oldValue = this._store[key];
    this._store[key] = value;
    return Promise.resolve(oldValue);
  },

  delete(key) {
    const oldValue = this._store[key];
    delete this._store[key];
    return Promise.resolve(oldValue);
  },


  sanitizeKey(key) {
    return key.replace(/[\W_|]/g, '');
  },

  getInfo() {
    return {
      engine: 'memory',
      numValues: Object.keys(this._store).length,
    };
  },
};


module.exports = MemoryStore;
