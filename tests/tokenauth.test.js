const { expect } = require('chai');
const { createRequest, createResponse } = require('node-mocks-http');
const sinon = require('sinon');
const makeTokenAuth = require('../tokenauth');


describe('tokenAuth middleware', () => {
  const tokenAuth = makeTokenAuth('TEST');
  let req;
  let res;
  let next;

  beforeEach(() => {
    res = createResponse();
    next = sinon.spy();
  });

  it('Should allow GET without token', () => {
    req = createRequest();
    tokenAuth(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it('Should find token in "token" query parameter', () => {
    req = createRequest({ method: 'PUT', query: { token: 'TEST' } });
    tokenAuth(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it('Should find token in "x-auth-token" header', () => {
    req = createRequest({ method: 'PUT', headers: { 'x-auth-token': 'TEST' } });
    tokenAuth(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it('Should respond with status 403 if no token provided', () => {
    req = createRequest({ method: 'PUT' });
    tokenAuth(req, res, next);
    expect(res.statusCode).to.equal(403);
  });

  it('Should respond with status 403 if token doesnt match', () => {
    req = createRequest({ method: 'PUT', query: { token: 'INVALID' } });
    tokenAuth(req, res, next);
    expect(res.statusCode).to.equal(403);
  });

  it('Should set error message if token is invalid or missing', () => {
    req = createRequest({ method: 'PUT' });
    tokenAuth(req, res, next);
    expect(res._getData()).to.contain('Invalid or missing auth token');
  });

  it('Should fail to init in production if token is missing', () => {
    expect(() => { makeTokenAuth(); }).to.throw();
  });
});
