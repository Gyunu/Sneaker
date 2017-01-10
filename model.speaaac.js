let chai = require('chai');
let assert = chai.assert;
let chaiAsPromised = require('chai-as-promised');
let sinon = require('sinon');

chai.use(chaiAsPromised);

class QueryMock {
  constructor() {
    this.limit = null;
    this.offset = null;
  }
  getColumnNames() {}
  buildWhere() {}
  addWhere() {}
  buildWhereBetween() {}
  where() {}
  select() {}
  update() {}
  create() {}
  get() {}
}

let getColumnNamesStub = sinon.stub(QueryMock.prototype, 'getColumnNames', () => ['id', 'title']);
let addWhereStub = sinon.stub(QueryMock.prototype, 'addWhere', () => {});
let buildWhereBetweenStub = sinon.stub(QueryMock.prototype, 'buildWhereBetween', () => {});

let Model = require('./model');

let Mock = require('./mocks/mock.model');
let MockRelationship = require('./mocks/relationship.model');

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


/*******************************************************************************

  Static Methods

********************************************************************************/

/*
  Where
*/
describe('Model.where', function() {
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
  });
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
    let model = Mock.where('id', '=', 1, undefined, new QueryMock());
    sinon.assert.calledWith(addWhereStub, 'id', '=', 1);
  });
  it('Should return an instance of itself', function() {
    let model = Mock.where('id', '=', 1, undefined, queryMock);
    chai.expect(model).to.be.an.instanceof(Mock);
  });
});

/*
  WhereBetween
*/
describe('Model.whereBetween', function() {
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
  });
  it('Should be a static function', function() {
    chai.expect(Mock.whereBetween).to.be.a('function');
  });
  it('Should throw an error if no column name is passed', function() {
    chai.expect(() => { Mock.whereBetween(undefined, undefined, undefined, undefined, queryMock) }).to.throw(Error);
  });
  it('Should throw an error if no start value is passed', function() {
    chai.expect(() => { Mock.whereBetween('id', undefined, undefined, undefined, queryMock) }).to.throw(Error);
  });
  it('Should throw an error if no end value is passed', function() {
    chai.expect(() => { Mock.whereBetween('id', 1, undefined, undefined, queryMock)}).to.throw(Error);
  });
  it('Should have called Query with correct parameters', function() {
    let model = Mock.whereBetween('id', 1, 100, undefined, queryMock);
    sinon.assert.calledWith(buildWhereBetweenStub, 'id', 1, 100, null);
  });
  it('Should return an instance of itself', function() {
    let model = Mock.whereBetween('id', 1, 100, undefined, queryMock);
    chai.expect(model).to.be.an.instanceof(Mock);
  });
});

/*
  Find
*/
describe('Model.find', function() {
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
  });
  it('Should be a static function', function() {
    chai.expect(Mock.find).to.be.a('function');
  });
  it('Should throw an error if no id is passed', function() {
    chai.expect(() => { Mock.find(undefined, undefined, queryMock) }).to.throw(Error);
  });
  it('Should throw an error if id is not a number', function() {
    chai.expect(() => { Mock.find('1', undefined, queryMock) }).to.throw(Error);
  });
  it('Should have called Query with correct parameters', function() {
    let model = Mock.find(1, undefined, queryMock);
    sinon.assert.calledWith(addWhereStub, 'id', '=', 1);
  });
  it('Should return an instance of itself', function() {
    let model = Mock.find(1, undefined, queryMock);
    chai.expect(model).to.be.an.instanceof(Mock);
  });
});

/*******************************************************************************

  Class Methods

********************************************************************************/

/*
  andWhere
*/
describe('Model.andWhere', function() {
  let model;
  beforeEach(function() {
    model = new Mock(undefined, undefined, undefined, QueryMock);
  });
  it('Should throw an error if not instantiated', function() {
    chai.expect(() => Mock.andWhere()).to.throw(Error);
  });
  it('Should throw an error if column name is not passed', function() {
    chai.expect(() => model.andWhere(undefined, undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if predicate is not passed', function() {
    chai.expect(() => model.andWhere('test', undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if value is not passed', function() {
    chai.expect(() => model.andWhere('test', '=', undefined)).to.throw(Error);
  });
  it('Should call Query with the correct parameters', function() {
    model.andWhere('id', '=', 1);
    sinon.assert.calledWith(addWhereStub, 'id', '=', 1);
  });
  it('Should return itself', function() {
    let m = model.andWhere('id', '=', 1);
    chai.expect(m).to.equal(model);
  });
});

/*
  orWhere
*/
describe('Model.orWhere', function() {
  let model;
  beforeEach(function() {
    let queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if not instantiated', function() {
    chai.expect(() => Mock.orWhere()).to.throw(Error);
  });
  it('Should throw an error if column name is not passed', function() {
    chai.expect(() => model.orWhere(undefined, undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if predicate is not passed', function() {
    chai.expect(() => model.orWhere('test', undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if value is not passed', function() {
    chai.expect(() => model.orWhere('test', '=', undefined)).to.throw(Error);
  });
  it('Should call Query with the correct parameters', function() {
    model.orWhere('id', '=', 1);
    sinon.assert.calledWith(addWhereStub, 'id', '=', 1);
  });
  it('Should return itself', function() {
    let m = model.orWhere('id', '=', 1);
    chai.expect(m).to.equal(model);
  });
});

/*
  andWhereBetween
*/
describe('Model.andWhereBetween', function() {
  let model;
  let queryMock
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if not instantiated', function() {
    chai.expect(() => Mock.andWhereBetween()).to.throw(Error);
  });
  it('Should throw an error if no column name is passed', function() {
    chai.expect(() => { model.andWhereBetween(undefined, undefined, undefined, undefined, queryMock) }).to.throw(Error);
  });
  it('Should throw an error if no start value is passed', function() {
    chai.expect(() => { model.andWhereBetween('id', undefined, undefined, undefined, queryMock) }).to.throw(Error);
  });
  it('Should throw an error if no end value is passed', function() {
    chai.expect(() => { model.andWhereBetween('id', 1, undefined, undefined, queryMock)}).to.throw(Error);
  });
  it('Should have called Query with correct parameters', function() {
    model.andWhereBetween('id', 1, 100, undefined, queryMock);
    sinon.assert.calledWith(buildWhereBetweenStub, 'id', 1, 100, 'AND');
  });
  it('Should return an instance of itself', function() {
    let m = model.andWhereBetween('id', 1, 100, undefined, queryMock);
    chai.expect(m).to.equal(model);
  });
});

/*
  orWhereBetween
*/
describe('Model.orWhereBetween', function() {
  let model;
  let queryMock
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if not instantiated', function() {
    chai.expect(() => Mock.orWhereBetween()).to.throw(Error);
  });
  it('Should throw an error if no column name is passed', function() {
    chai.expect(() => { model.orWhereBetween(undefined, undefined, undefined, undefined, queryMock) }).to.throw(Error);
  });
  it('Should throw an error if no start value is passed', function() {
    chai.expect(() => { model.orWhereBetween('id', undefined, undefined, undefined, queryMock) }).to.throw(Error);
  });
  it('Should throw an error if no end value is passed', function() {
    chai.expect(() => { model.orWhereBetween('id', 1, undefined, undefined, queryMock)}).to.throw(Error);
  });
  it('Should have called Query with correct parameters', function() {
    model.orWhereBetween('id', 1, 100, undefined, queryMock);
    sinon.assert.calledWith(buildWhereBetweenStub, 'id', 1, 100, 'OR');
  });
  it('Should return an instance of itself', function() {
    let m = model.orWhereBetween('id', 1, 100, undefined, queryMock);
    chai.expect(m).to.equal(model);
  });
});


/*
  has
*/
describe('Model.has', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if the model is not passed', function() {
    chai.expect(() => model.has(undefined, undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if foreign column is not passed', function() {
    chai.expect(() => model.has(Mock, undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if foreign column is not a string', function() {
    chai.expect(() => model.has(Mock, 1, undefined)).to.throw(Error);
  });
  it('Should throw an error if root column is not passed', function() {
    chai.expect(() => model.has(Mock, 'mock_id', undefined)).to.throw(Error);
  });
  it('Should throw an error if root column is not a string', function() {
    chai.expect(() => model.has(Mock, 'mock_id', 1)).to.throw(Error);
  });
  it('Should return a correct object', function() {
    let mod = Model;
    let onColumn = 'test_id';
    let rootColumn = 'id';

    let o = model.has(mod, onColumn, rootColumn);

    chai.expect(o.model).to.equal(mod);
    chai.expect(o.onColumn).to.equal(onColumn);
    chai.expect(o.rootColumn).to.equal(rootColumn);
  })
});

/*
  with
*/
describe('Model.with', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if relationship name is not passed', function() {
    chai.expect(() => model.with(undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if the relationship is not defined on the model', function() {
    chai.expect(() => model.with('notFound', undefined)).to.throw(Error);
  });
  it('Should throw an error if callback is defined and not a function', function() {
    chai.expect(() => model.with('relationship', 'error')).to.throw(Error);
  });
  it('Should push relationship to the the relationships array', function() {
    model.with('relationship', undefined);
    chai.expect(model.relationships.length).to.equal(1);
  });
  it('Should push the correct format to the relationships array', function() {
    model.with('relationship', undefined);
    chai.expect(model.relationships[0].name).to.equal('relationship');
    chai.expect(model.relationships[0].callback).to.equal(undefined);
  });
  it('Should push the correct format with a callback function to the relationships array', function() {
    model.with('relationship', () => {});
    chai.expect(model.relationships[0].name).to.equal('relationship');
    chai.expect(model.relationships[0].callback).to.be.a('function');
  });
  it('Should return itself', function() {
    let m = model.with('relationship');
    chai.expect(m).to.equal(model);
  });
});


/*
  limit
*/
describe('Model.limit', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if limit is not passed', function() {
    chai.expect(() => model.limit(undefined)).to.throw(Error);
  });
  it('Should throw an error if limit is not a number', function() {
    chai.expect(() => model.limit('1')).to.throw(Error);
  });
  it('Should set Query limit', function() {
    model.limit(1);
    chai.expect(model.query.limit).to.equal(1);
  });
  it('Should return itself', function() {
    let m = model.limit(1);
    chai.expect(m).to.equal(model);
  });
});

/*
  offset
*/
describe('Model.offset', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if offset is not passed', function() {
    chai.expect(() => model.offset(undefined)).to.throw(Error);
  });
  it('Should throw an error if offset is not a number', function() {
    chai.expect(() => model.offset('1')).to.throw(Error);
  });
  it('Should set Query offset', function() {
    model.offset(1);
    chai.expect(model.query.offset).to.equal(1);
  });
  it('Should return itself', function() {
    let m = model.offset(1);
    chai.expect(m).to.equal(model);
  });
});

/*
  asJson
*/
describe('Model.asJson', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should set jsonOnly to true', function() {
    model.asJson();
    chai.expect(model.jsonOnly).to.equal(true);
  });
  it('Should set attributesOnly to false', function() {
    model.asJson();
    chai.expect(model.attributesOnly).to.equal(false);
  });
  it('Should return itself', function() {
    let m = model.asJson(true);
    chai.expect(m).to.equal(model);
  });
});

/*
  asAttributes
*/
describe('Model.asAttributes', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should set asAttributes to true', function() {
    model.asAttributes();
    chai.expect(model.attributesOnly).to.equal(true);
  });
  it('Should set jsonOnly to false', function() {
    model.asAttributes();
    chai.expect(model.jsonOnly).to.equal(false);
  });
  it('Should return itself', function() {
    let m = model.asAttributes(true);
    chai.expect(m).to.equal(model);
  });
});

/*
  updateAttribute
*/
describe('Model.updateAttribute', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if name is not passed', function() {
    chai.expect(() => model.updateAttribute(undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if attribute does not exist', function() {
    chai.expect(() => model.updateAttribute('notFound', undefined)).to.throw(Error);
  });
  it('Should set the attribute if it exists', function() {
    model.updateAttribute('id', 1);
    chai.expect(model.attributes.id).to.equal(1);
  });
  it('Should return itself', function() {
    let m = model.updateAttribute('id', 1);
    chai.expect(m).to.equal(model);
  });
});

/*
  hydrate
*/
describe('Model.hydrate', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if argument is not an object', function() {
    chai.expect(() => model.hydrate(1)).to.throw(Error);
  });
  it('Should throw an error if attribute does not exist', function() {
    chai.expect(() => model.hydrate({'notFound': 'error'})).to.throw(Error);
  });
  it('Should set the attribute if it exists', function() {
    model.hydrate({
      id: 1
    });
    chai.expect(model.attributes.id).to.equal(1);
  });
  it('Should return itself', function() {
    let m = model.hydrate({
      id: 1
    });
    chai.expect(m).to.equal(model);
  });
});

/*
  hydrateNewInstance
*/
describe('Model.hydrateNewInstance', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if argument is not an object', function() {
    chai.expect(() => model.hydrateNewInstance(1)).to.throw(Error);
  });
  it('Should throw an error if attribute does not exist', function() {
    chai.expect(() => model.hydrateNewInstance({'notFound': 'error'})).to.throw(Error);
  });
  it('Should set the attribute if it exists', function() {
    let m = model.hydrateNewInstance({
      id: 1
    });
    chai.expect(m.attributes.id).to.equal(1);
  });
  it('Should return a new instance', function() {
    let m = model.hydrateNewInstance({
      id: 1
    });
    chai.expect(m).to.not.equal(model);
  });
});

/*
  getAttributes
*/
describe('Model.getAttributes', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should return the models attributes', function() {
    let attributes = model.getAttributes();
    chai.expect(attributes).to.have.property('id');
  });
  it('Should return the models attributes when the have been updated', function() {
    model.updateAttribute('id', 1);
    let attributes = model.getAttributes();
    chai.expect(attributes).to.have.property('id');
    chai.expect(attributes.id).to.equal(1);
  });
});

/*
  getAttributes
*/
describe('Model.getAttributesAsJson', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should return a string, which is JSON', function() {
    let attributes = model.getAttributesAsJson();
    chai.expect(typeof attributes == 'string').to.equal(true);
  });
  it('Should return parseable JSON', function() {
    let attributes = model.getAttributesAsJson();
    chai.expect(() => JSON.parse(attributes)).to.not.throw(Error);
  });
  it('Should have the correct properties when parsed', function() {
    model.updateAttribute('id', 1);
    let attributes = model.getAttributesAsJson();
    let obj = JSON.parse(attributes);
    chai.expect(obj).to.have.property('id');
    chai.expect(obj.id).to.equal(1);
  });
});

/*
  pick
*/
describe('Model.pick', function() {
  let model;
  let queryMock;

  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if the argument is not a string', function() {
    chai.expect(() => { model.pick() }).to.throw(Error);
    chai.expect(() => { model.pick(1)}).to.throw(Error);
  });
  it('Should throw an error if the argument does not exist in the columns', function() {
    chai.expect(() => { model.pick('error')}).to.throw(Error);
  });
  it('Should push the column to the pick columns array', function() {
    model.pick('title');
    chai.expect(model.pickColumns.length).to.equal(1);
  });
  it('Should return itself', function() {
    let m = model.pick('title');
    chai.expect(m).to.equal(model);
  });
});


/*
  hide
*/
describe('Model.hide', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if the argument is not a string', function() {
    chai.expect(() => { model.hide() }).to.throw(Error);
    chai.expect(() => { model.hide(1)}).to.throw(Error);
  });
  it('Should throw an error if the argument does not exist in the columns', function() {
    chai.expect(() => { model.hide('error')}).to.throw(Error);
  });
  it('Should push the column to the hidden columns array', function() {
    model.hide('title');
    chai.expect(model.hiddenColumns.length).to.equal(1);
  });
  it('Should return itself', function() {
    let m = model.hide('title');
    chai.expect(m).to.equal(model);
  });
});


/*
  flatten
*/
describe('Model.flatten', function() {
  let model;
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should return an object of attributes', function() {
    let attributes = model.flatten();
    chai.expect(typeof attributes == 'object').to.equal(true);
  });
  it('Should have the correct properties', function() {
    model.updateAttribute('id', 1);
    let attributes = model.flatten();
    chai.expect(attributes).to.have.property('id');
    chai.expect(attributes.id).to.equal(1);
  });
});

/*
  addRelationshipQuery
*/
describe('Model.addRelationshipQuery', function() {
  let model;
  let modelWhereStub = sinon.stub(MockRelationship, 'where', () => { return new MockRelationship(undefined, undefined, undefined, QueryMock)});
  let modelGetStype = sinon.stub(MockRelationship.prototype, 'get', () => { return new Promise(() => {}, () => {})});
  let modelAsAttributesStub = sinon.stub(MockRelationship.prototype, 'asAttributes', () => {});
  let callbackStub = sinon.stub();
  let queryMock;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  it('Should throw an error if model is not passed', function() {
    chai.expect(() => model.addRelationshipQuery(undefined, undefined, undefined, undefined, undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if column is not passed', function() {
    chai.expect(() => model.addRelationshipQuery(MockRelationship, undefined, undefined, undefined, undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if predicate is not passed', function() {
    chai.expect(() => model.addRelationshipQuery(MockRelationship, 'test', undefined, undefined, undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if value is not passed', function() {
    chai.expect(() => model.addRelationshipQuery(MockRelationship, 'test', "=", undefined, undefined, undefined)).to.throw(Error);
  });
  it('Should call the model.where with correct parameters', function() {
    model.addRelationshipQuery(MockRelationship, 'test_id', '=', 1);
    sinon.assert.calledWith(modelWhereStub, 'test_id', '=', 1);
  });
  it('Should invoke the callback if passed', function() {
    model.addRelationshipQuery(MockRelationship, 'test_id', '=', 1, callbackStub);
    sinon.assert.called(callbackStub);
  });
  it('Should set the relationship model to as attributes if passed', function() {
    model.addRelationshipQuery(MockRelationship, 'test_id', '=', 1, undefined, true);
    sinon.assert.called(modelAsAttributesStub);
  });
  it('Should push the relationship query to an array', function() {
    model.addRelationshipQuery(MockRelationship, 'test_id', '=', 1);
    chai.expect(model.relationshipQueries.length).to.equal(1);
  });
});

/*
  get
*/
describe('Model.get', function() {
  let model;
  let queryMock;
  let selectStub;
  beforeEach(function() {
    queryMock = new QueryMock();
    model = new Mock(undefined, undefined, undefined, queryMock);
  });
  before(function() {
    selectStub = sinon.stub(QueryMock.prototype, 'select', () => Promise.resolve(
      [{
        'id': 1,
        'title': 'test'
      }]
    ));
  });
  it('Should throw an error if the model has not been instantiated by where, whereBetween or find', function() {
    chai.expect(() => model.get()).to.throw(Error);
  });
  it('Should call Query.select with the correct parameters', function() {
    Mock.find(1, undefined, queryMock).get().then(() => {
      sinon.assert.calledWith(selectStub, ['id', 'title']);
    });
  });
  it('Should return a promise', function() {
    chai.expect(Mock.find(1, undefined, queryMock).get() instanceof Promise).to.equal(true);
  });
  it('Should return an array of Mock instances', function() {
    Mock.find(1, undefined, queryMock).get()
    .then((results) => {
      chai.expect(results.length).to.equal(1);
      //use this because of a chai error on comparing types.
      chai.expect(results[0] instanceof Mock).to.equal(true);
    });
  });
  it('Should return a Mock instance in the array with the correct attributes', function() {
    Mock.find(1, undefined, queryMock).get()
    .then((results) => {
      chai.expect(results[0]).to.have.property('attributes');
      chai.expect(results[0].attributes).to.have.property('id');
      chai.expect(results[0].attributes.id).to.equal(1);
      chai.expect(results[0].attributes).to.have.property('title');
      chai.expect(results[0].attributes.title).to.equal('test');
    });
  });
  it('Should return attributes if asAttributes is called', function() {
    Mock.find(1, undefined, queryMock).asAttributes().get()
    .then((results) => {
      chai.expect(!(results[0] instanceof Mock)).to.equal(true);
    });
  });
  it('Should return the correct attributes if asAttributes is called', function() {
    Mock.find(1, undefined, queryMock).asAttributes().get()
    .then((results) => {
      chai.expect(results[0]).to.have.property('id');
      chai.expect(results[0].id).to.equal(1);
      chai.expect(results[0]).to.have.property('title');
      chai.expect(results[0].title).to.equal('test');
    });
  });
  it('Should call query with only pick columns if set', function() {
    Mock.find(1, undefined, queryMock).pick('title').get().then(() => {
      sinon.assert.calledWith(selectStub, ['title']);
    });
  });
  it('Should resolve relationships and return them in the attributes', function() {
  });
});
