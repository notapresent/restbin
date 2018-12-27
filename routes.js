const express = require('express');

const makeRouter = (store, serverInfo) => {
  const router = new express.Router();

  router.param('key', (req, res, next, rawKey) => {
    const key = store.sanitizeKey(rawKey);
    if (key !== rawKey) {
      res.status(400).json({ message: 'Invalid key' });
    } else {
      req.key = key;
      next();
    }
  });

  function ensureBody(req, res, next) {
    if ((req.method === 'POST' || req.method === 'PUT') && !Object.keys(req.body).length) {
      res.status(400).json({ message: 'Invlid content type' });
    } else {
      next();
    }
  }

  router.use(ensureBody);

  router.get('/', (req, res) => {
    res.json(serverInfo());
  });

  router.get('/:key', (req, res) => {
    const value = store.get(req.key);

    if (value === null) {
      res.status(404).end();
    } else {
      res.status(200).set('Content-Type', 'application/json').send(value);
    }
  });

  router.put('/:key', (req, res) => {
    const exists = store.get(req.key) !== null; // TODO store.exists(key)
    store.put(req.key, req.body.toString());
    res.status(exists ? 204 : 201).end();
  });

  router.post('/', (req, res) => {
    const newKey = store.put(null, req.body.toString());
    res.status(201).json({ key: newKey });
  });

  router.delete('/:key', (req, res) => {
    const exists = store.get(req.key) !== null; // TODO store.exists(key)
    if (exists) {
      store.delete(req.key);
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  });

  return router;
};

module.exports = makeRouter;
