const chai = require('chai');
const chaiHttp = require('chai-http');
const series = require('async/series');

const { makeApp } = require('../app');

chai.use(chaiHttp);
const should = chai.should();


const AUTH_TOKEN = 'testtoken';

describe('App', () => {
  let app;

  beforeEach('Create app and put one key', async () => {
    app = await makeApp({ token: AUTH_TOKEN });
    chai.request(app)
      .put(`/testKey?token=${AUTH_TOKEN}`)
      .send({ objKey: 'objValue' })
      .end((error, response) => { // eslint-disable-line no-unused-vars
        if (error) {
          throw new Error(error);
        }
        // done();
      });
  });

  describe('GET', () => {
    it('/key should return 200 response with prevoiusly put value', (done) => {
      chai.request(app)
        .get('/testKey')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.objKey.should.equal('objValue');
          done();
        });
    });

    it('/NonExistentKey should return 404', (done) => {
      chai.request(app)
        .get('/nonExistentKey')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(404);
          res.body.should.be.empty;
          done();
        });
    });
  });


  describe('PUT', () => {
    it('/key should return 201 and save new value', (done) => {
      series([
        (cb) => {
          chai.request(app)
            .put(`/newTestKey?token=${AUTH_TOKEN}`)
            .send({ objKey: 'objValue' })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(201);
              res.body.should.be.empty;
              cb();
            });
        },
        (cb) => {
          chai.request(app)
            .get('/newTestKey')
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(200);
              res.body.objKey.should.equal('objValue');
              cb();
            });
        },
      ], done);
    });

    it('/key should return 204 and overwrite existing value', (done) => {
      series([
        (cb) => {
          chai.request(app)
            .put(`/testKey?token=${AUTH_TOKEN}`)
            .send({ objKey: 'newObjValue' })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(204);
              cb();
            });
        },
        (cb) => {
          chai.request(app)
            .get('/testKey')
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(200);
              res.body.objKey.should.equal('newObjValue');
              cb();
            });
        },
      ], done);
    });

    it('/invalidKey should return 400', (done) => {
      chai.request(app)
        .put(`/_!invalidKey_@?token=${AUTH_TOKEN}`)
        .send({ objKey: 'objValue' })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(400);
          done();
        });
    });

    it('request without token should return 403', (done) => {
      chai.request(app)
        .put('/testKey') // no token!
        .send({ objKey: 'newObjValue' })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(403);
          done();
        });
    });

    it('Content-types other than application/json should result in 400', (done) => {
      chai.request(app)
        .put(`/testKey?token=${AUTH_TOKEN}`)
        .set('content-type', 'text/plain')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(400);
          done();
        });
    });
  });

  describe('DELETE', () => {
    it('/key should delete existing key and return 204', (done) => {
      chai.request(app)
        .delete(`/testKey?token=${AUTH_TOKEN}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(204);
          res.body.should.be.empty;
          done();
        });
    });

    it('/nonExistentKey should return 404', (done) => {
      chai.request(app)
        .delete(`/nonExistentKey?token=${AUTH_TOKEN}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(404);
          res.body.should.be.empty;
          done();
        });
    });
    it('/key without token should result in 403', (done) => {
      chai.request(app)
        .delete('/testKey') // no token!
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(403);
          done();
        });
    });
  });
});
