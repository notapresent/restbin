const chai = require('chai');
// chaiAsPromised = require('chai-as-promised'),
const { MemoryStore } = require('../models');
// chai.use(chaiAsPromised);
const { expect } = chai;


describe('MemoryStore', () => {
  let store;

  beforeEach('Create new empty store', () => {
    store = Object.create(MemoryStore);
  });

  describe('get', () => {
    it('Should return null for non-existent key', () => {
      expect(store.get('fake')).to.be.null;
    });

    it('Should return value, previously stored with put', () => {
      store.put('key', 'value');
      expect(store.get('key')).to.equal('value');
    });
  });

  describe('put', () => {
    it('Should overwrite existing value', () => {
      store.put('key', 'oldValue');
      store.put('key', 'newValue');
      expect(store.get('key')).to.equal('newValue');
    });

    it('Should generate and return random key if called with null key', () => {
      const newKey = store.put(null, 'value');
      const storedValue = store.get(newKey);
      expect(newKey).to.be.a('string');
      expect(storedValue).to.equal('value');
    });

    it('Should throw if key or value isnt string', () => {
      expect(() => { store.put([], 'test'); }).to.throw();
      expect(() => { store.put('test', []); }).to.throw();
    });
  });

  describe('delete', () => {
    it('Should delete value at key', () => {
      store.put('key', 'value');
      store.delete('key');
      expect(store.get('key')).to.be.null;
    });
  });

  describe('key management', () => {
    it('sanitizeKey should filter all non-alphanumeric characters', () => {
      const rawKey = '!@#Abc123$%^';
      const sanitizedKey = store.sanitizeKey(rawKey);
      expect(sanitizedKey).to.be.a('string');
      expect(sanitizedKey).to.equal('Abc123');
    });

    it('createKey should create alphanumeric key of specified length', () => {
      const key = store.createKey(8);
      expect(key).to.be.a('string');
      expect(key.length).to.equal(8);
      expect((/^[A-Za-z0-9]{8}$/).test(key)).to.be.true;
    });
  });
});
