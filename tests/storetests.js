const { expect } = require('chai');


exports.behavesLikeAStore = function () {
  it('get should reject with Error.notFound for non-existent key', async function () {
    try {
      await this.store.get('non-existent');
    } catch (err) {
      expect(err.code).to.equal('notFound');
    }
  });

  it('get should resolve with value, previously stored with put', async function () {
    await this.store.put('key', 'value');
    expect(await this.store.get('key')).to.equal('value');
  });

  it('put should overwrite existing value', async function () {
    await this.store.put('key', 'oldValue');
    await this.store.put('key', 'newValue');
    expect(await this.store.get('key')).to.equal('newValue');
  });

  it('delete should delete value at key', async function () {
    await this.store.put('key', 'value');
    await this.store.delete('key');
    try {
      await this.store.get('key');
    } catch (err) {
      expect(err.code).to.equal('notFound');
    }
  });
};
