const pkgJson = require('../package.json');


function serverInfo(store) {
  const info = {
    server: `${pkgJson.name}/${pkgJson.version}`,
  };

  if (store) {
    info.storeInfo = store.getInfo();
  }
  return info;
}

module.exports = serverInfo;
