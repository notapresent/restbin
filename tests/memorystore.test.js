const MemoryStore = require('../models/memorystore');
const storetests = require('./storetests');


describe('MemoryStore', () => {
  beforeEach('Create and open new empty store', async function () {
    this.store = Object.create(MemoryStore);
    await this.store.open();
  });

  storetests.behavesLikeAStore();
});
