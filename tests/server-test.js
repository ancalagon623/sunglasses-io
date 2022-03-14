const server = require('../app/server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Sunglasses', () => {
  describe('GET all Sunglasses', () => {
    it('should return an array of sunglasses', (done) => {
      chai.request(server).get("/sunglasses").end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('brandId');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('description');
        res.body[0].should.have.property('imageUrls');
        res.body[0].should.have.property('inStock');
        res.body[0].should.have.property('price');
        done();
      }) 
    })
    it('should return an array when a query is entered', (done) => {
      const query = {
        search: "brown"
      };

      chai.request(server)
        .get('/sunglasses')
        .query(query)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].id.should.equal('3');
          done();
        })
    })
    it('should return only inStock items if specified', (done) => {
      const query = {
        inStock: 'true'
      };

      chai.request(server)
        .get('/sunglasses')
        .query(query)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].inStock.should.equal(true);
          done();
        })
    })
    it('should not return anything if the inStock query is invalid', (done) => {
      const query = {
        inStock: 'blah',
      };

      chai.request(server)
        .get('/sunglasses')
        .query(query)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.not.be.an('object')
          done();
        })
    })
    it('should not return anything if the search is invalid', (done) => {
      const query = {
        search: '',
      };

      chai.request(server)
        .get('/sunglasses')
        .query(query)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.empty;
          done();
        })
    })
  })
  describe('GET sunglasses by id', () => {
    it('should return a sunglasses object', (done) => {

      chai.request(server)
        .get('/sunglasses/2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.id.should.equal('2');
          done();
        })
    })
    it('should return an error if the id is invalid', (done) => {

      chai.request(server)
        .get('/sunglasses/fhdjskfh')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.not.be.an('object');
          done();
        })
    })
  })
});

describe('Brands', () => {
  describe('GET all brands', () => {
    it('should return an array of brands', (done) => {

      chai.request(server)
        .get('/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          done();
        })
    })
  })
  describe('GET sunglasses by brand id', () => {
    it('should return an array of sunglasses', (done) => {

      chai.request(server)
        .get('/brands/1/sunglasses')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('inStock');
          done();
        })
    })
    it('should not return sunglasses if the brand id does not exist/is invalid', (done) => {

      chai.request(server)
        .get('/brands/450000/sunglasses')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.not.be.an('array');
          res.body.should.not.have.property('inStock');
          res.body.should.not.have.property('brandId');
          res.body.should.not.have.property('id');
          res.body.should.not.have.property('imageUrls');
          res.body.should.not.have.property('name');
          res.body.should.not.have.property('description');
          done();
        })
    })
  })
});

describe('Login', () => {
  describe('the POST login endpoint', () => {
    it('should return a valid token', (done) => {
      const login = {
        username: 'yellowleopard753',
        password: 'jonjon'
      }

      chai.request(server)
        .post('/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('string');
          res.body.length.should.be(16);
          done();
        })
    })
    it('should return an error if the username/password is incorrect', (done) => {
      const fakeLogin = {
        username: 'dsfdfde',
        password: '7886highjk'
      }

      chai.request(server)
        .post('/login')
        .send(fakeLogin)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.be.a('string');
          res.body.length.should.not.be(16);
          done();
        })
    })
    it('should return an error if no username or password is given', (done) => {
      
      chai.request(server)
        .post('/login')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.be.a('string');
          res.body.length.should.not.be(16);
          done();
        })
    })
  })
});

describe('Cart', () => {});