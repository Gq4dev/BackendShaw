const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Test Api Endpoints', function () {
    before(function () {

    });

    after(function () {

    });

    it('should upload a csv file', function (done) {
        chai.request(app)
            .post('/api/files')
            .attach('file', './file.csv')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('The file was uploaded successfully');
                done();
            });
    });


    it('should filter users', function (done) {
        chai.request(app)
            .get('/api/users')
            .query({ q: 'Doe' })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

});
