const chai = require('chai');
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

chai.use(chaiHttp);
const expect = chai.expect;

const app = require('../app');

describe('Auth API ტესტები', () => {
  before(async function () {
    this.timeout(15000);
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: '123456',
  };

  describe('POST /api/auth/register', () => {
    it('უნდა დარეგისტრირდეს ვალიდური მონაცემებით', (done) => {
      chai
        .request(app)
        .post('/api/auth/register')
        .send(testUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('არ უნდა დარეგისტრირდეს მოკლე პაროლით', (done) => {
      chai
        .request(app)
        .post('/api/auth/register')
        .send({ name: 'X', email: 'short@test.com', password: '123' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('არასწორი პაროლით login ვერ მოხერხდება', (done) => {
      chai
        .request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });

    it('სწორი მონაცემებით login წარმატებით დასრულდება', (done) => {
      chai
        .request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.property('token');
          done();
        });
    });
  });
});