const { expect } = require('chai');
const serverInfo = require('../models/serverinfo');
const pkgJson = require('../package.json');


describe('serverInfo', () => {
  it('should return server name and version', () => {
    const info = serverInfo();
    expect(info.server).to.include(pkgJson.name);
    expect(info.server).to.include(pkgJson.version);
  });

  it('Should include store-specific info if store is provided', () => {
    const info = serverInfo({ getInfo() { return 'something'; } });
    expect(info.storeInfo).to.include('something');
  });
});
