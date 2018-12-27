const pkgJson = require('./package.json');

const VALID_KEY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomString(len) {
  const chars = [];
  while (chars.length < len) {
    chars.push(VALID_KEY_CHARS.charAt(randomInt(VALID_KEY_CHARS.length)));
  }
  return chars.join('');
}

const MemoryStore = {
  get(key) {
    return typeof this.store[key] === 'undefined' ? null : this.store[key];
  },

  put(key, value) {
    if (typeof key !== 'string' && key !== null) {
      throw new Error('Key must be string or null');
    }

    if (typeof value !== 'string') {
      throw new Error('Value must be string');
    }

    const actualKey = key === null ? this.createKey() : key;
    this.store[actualKey] = value;
    return actualKey;
  },

  delete(key) {
    delete this.store[key];
    return null;
  },

  createKey(len = 8) {
    let key;
    do {
      key = randomString(len);
    } while (this.get(key) !== null);
    return key;
  },

  sanitizeKey(key) {
    return key.replace(/[\W_|]/g, '');
  },

  getInfo() {
    return {
      engine: 'memory',
      numValues: Object.keys(this.store).length,
    };
  },
};

Object.defineProperty(MemoryStore, 'store', {
  get: function getStore() {
    if (!this._store) {
      this._store = {};
    }
    return this._store;
  },
});

function serverInfo(store) {
  const info = {
    server: `${pkgJson.name}/${pkgJson.version}`,
  };

  if (store) {
    info.storeInfo = store.getInfo();
  }
  return info;
}

module.exports = { MemoryStore, serverInfo };
