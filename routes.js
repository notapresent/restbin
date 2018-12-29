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

  router.get('/:key', async (req, res) => {
    try {
      const value = await store.get(req.key);
      res.status(200).set('Content-Type', 'application/json').send(value);
    } catch (err) {
      if (err.code === 'notFound') {
        res.status(404).end();
      } else {
        res.status(500).end();
      }
    }
  });

  router.put('/:key', async (req, res) => {
    try {
      const oldValue = await store.put(req.key, req.body.toString());
      res.status(typeof oldValue === 'undefined' ? 201 : 204).end();
    } catch (err) {
      res.status(500).end();
    }
  });

  router.delete('/:key', async (req, res) => {
    try {
      const oldValue = await store.delete(req.key);
      res.status(typeof oldValue === 'undefined' ? 404 : 204).end();
    } catch (err) {
      res.status(500).end();
    }
  });

  return router;
};

module.exports = makeRouter;
