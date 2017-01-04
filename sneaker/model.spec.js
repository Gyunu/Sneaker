let chai = require('chai');
let assert = chai.assert;
let chaiAsPromised = require('chai-as-promised');
let sinon = require('sinon');
let rewire = require("rewire");


chai.use(chaiAsPromised);

class QueryMock {
  constructor() {
    this.limit = null;
    this.offset = null;
  }
  getColumnNames() {}
  buildWhere() {}
  buildWhereBetween() {}
  select() {}
  update() {}
  create() {}
}

// let getColumnNamesStub = sinon.stub(QueryMock.prototype, 'getColumnNames', () => ['id']);
// let buildWhereStub = sinon.stub(QueryMock.prototype, 'buildWhere', () => {});


let Model = rewire('./model');
let Mock = rewire('../lib/mocks/mock.model');

Model.__set__('Query', QueryMock);
Mock.__set__('Model', Model);


describe('Abstact Model', function() {
  it('Should throw an error if instantiated by itself', function() {
    chai.expect(() => { let m = new Model()}).to.throw(Error);
  });
});


/*
  constructor
*/
describe('Model.constructor', function() {
  it('Should throw an error if database name is not passed as an option', function() {
    chai.expect(() => { let m = new Mock({}); }).to.throw(Error);
  });
});


/*
  Where
*/
describe('Model.where', function() {
  it('Should be a static function', function() {
    chai.expect(Mock.where).to.be.a('function');
  });
  it('Should throw an error if no column name is passed', function() {
    chai.expect(() => { Mock.where() }).to.throw(Error);
  });
  it('Should throw an error if no predicate is passed', function() {
    chai.expect(() => { Mock.where('id') }).to.throw(Error);
  });
  it('Should throw an error if no value is passed', function() {
    chai.expect(() => { Mock.where('id', '=')}).to.throw(Error);
  });
  it('Should have called Query with correct parameters', function() {
    let model = Mock.where('id', '=', 1);
    chai.expect(buildWhereStub.calledWith).to.equal(true);
  });
  // it('Should return an instance of itself', function() {
  //   let model = TestModel.where('id', '=', 1);
  //   chai.expect(model).to.be.an.instanceof(TestModel);
  // });
});
