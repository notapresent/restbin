module.exports = function makeTokenAuth(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is required for token auth to function');
  }

  return function tokenAuth(req, res, next) {
    const reqToken = req.query.token || req.headers['x-auth-token'];
    if (req.method === 'GET' || req.method === 'HEAD') {
      next();
      return;
    }

    if (!reqToken || reqToken !== token) {
      res.status(403).json({ message: 'Invalid or missing auth token' });
    } else {
      next();
    }
  };
};
