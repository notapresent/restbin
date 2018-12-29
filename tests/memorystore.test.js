const chai = require('chai');
chai.use(require('chai-as-promised'));

const { expect } = chai;

const MemoryStore = require('../models/memorystore');


describe('MemoryStore', () => {
  let store;

  beforeEach('Create and open new empty store', async () => {
    store = Object.create(MemoryStore);
    await store.open();
  });

  afterEach('Close store', async () => {
    await store.close();
  });

  describe('get', () => {
    it('Should reject with Error.notFound for non-existent key', async () => {
      try {
        await store.get('non-existent');
      } catch (err) {
        expect(err.code).to.equal('notFound');
      }
    });

    it('Should resolve with value, previously stored with put', async () => {
      await store.put('key', 'value');
      expect(await store.get('key')).to.equal('value');
    });
  });


  describe('put', () => {
    it('Should overwrite existing value', async () => {
      await store.put('key', 'oldValue');
      await store.put('key', 'newValue');
      expect(await store.get('key')).to.equal('newValue');
    });
  });

  describe('delete', () => {
    it('Should delete value at key', async () => {
      await store.put('key', 'value');
      await store.delete('key');
      try {
        await store.get('key');
      } catch (err) {
        expect(err.code).to.equal('notFound');
      }
    });
  });

  describe('key management', () => {
    it('sanitizeKey should filter all non-alphanumeric characters', () => {
      const rawKey = '!@#Abc123$%^';
      const sanitizedKey = store.sanitizeKey(rawKey);
      expect(sanitizedKey).to.be.a('string');
      expect(sanitizedKey).to.equal('Abc123');
    });
  });
});
