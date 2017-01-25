let chai = require('chai');
let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
let sinon = require('sinon');

let Model = require('./model');

chai.use(chaiAsPromised);

describe('Model.constructor', function() {
  it('Should throw an error if the model name is not defined', function() {
    expect(
      () => {
        new Model({
          database: 'test',
          table: 'test',
          hidden: [],
          fillable: [],
          relationships: {}
        })
      })
  });
  it('Should throw an error if the model name is not a string', function() {
    expect(
      () => {
        new Model({
          name: 2,
          database: 'test',
          table: 'test',
          hidden: [],
          fillable: [],
          relationships: {}
        })
      })
  });
  it('Should throw an error if the model database is not defined', function() {
    expect(
      () => {
        new Model({
          name: 'test',
          table: 'test',
          hidden: [],
          fillable: [],
          relationships: {}
        })
      })
  });
  it('Should throw an error if the model database is not a string', function() {
    expect(
      () => {
        new Model({
          name: 'test',
          database: 1,
          table: 'test',
          hidden: [],
          fillable: [],
          relationships: {}
        })
      })
  });
  it('Should throw an error if the model table is not defined', function() {
    expect(
      () => {
        new Model({
          name: 'test',
          database: 'test',
          hidden: [],
          fillable: [],
          relationships: {}
        })
      })
  });
  it('Should throw an error if the model table is not a string', function() {
    expect(
      () => {
        new Model({
          name: 'test',
          database: 'test',
          table: 1,
          hidden: [],
          fillable: [],
          relationships: {}
        })
      })
  });
  it('Should set the model name, table and database', function() {
    let m = new Model({
      'name': 'testName',
      'database': 'testDatabase',
      'table': 'testTable'
    });

    expect(m.name).to.equal('testName');
    expect(m.database).to.equal('testDatabase');
    expect(m.table).to.equal('testTable');

  });
  it('Should set the hidden fields', function() {
    let m = new Model({
      'name': 'testName',
      'database': 'testDatabase',
      'table': 'testTable',
      'hidden': ['test']
    });

    expect(m.hidden.length).to.equal(1);
    expect(m.hidden[0]).to.equal('test');
  });
});

describe('Model.with', function() {
  it('Should throw an error if relationship name is not passed', function() {
    let m = new Model({
      'name': 'testName',
      'database': 'testDatabase',
      'table': 'testTable',
      'hidden': ['test']
    });

    expect(() => model.with(undefined, undefined)).to.throw(Error);
  });
  it('Should throw an error if relationship name is not a string', function() {
    let m = new Model({
      'name': 'testName',
      'database': 'testDatabase',
      'table': 'testTable',
      'hidden': ['test']
    });

    expect(() => model.with(1, undefined)).to.throw(Error);
  });
  it('Should throw an error if the relationship is not defined on the model', function() {
    let m = new Model({
      'name': 'testName',
      'database': 'testDatabase',
      'table': 'testTable',
      'hidden': ['test'],
      'relationships': {
        'article': {
          'primary': 'article_id',
          'foreign': 'id'
        }
      }
    });
    expect(() => model.with('notDef', undefined)).to.throw(Error);
  });
  it('Should return itself', function() {
    let m = new Model({
      'name': 'testName',
      'database': 'testDatabase',
      'table': 'testTable',
      'hidden': ['test'],
      'relationships': {
        'article': {
          'primary': 'article_id',
          'foreign': 'id'
        }
      }
    });

    let q = m.with('article');

    expect(q).to.equal(m);

  });
});
