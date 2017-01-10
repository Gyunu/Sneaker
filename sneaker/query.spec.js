let chai = require('chai');
let assert = chai.assert;
let chaiAsPromised = require('chai-as-promised');
let sinon = require('sinon');

let Query = require('./query');

chai.use(chaiAsPromised);

class DatabaseMock {
  constructor() {}
}


describe('Query', function() {

});

describe('Query.select', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should throw an error if another query type has been started', function() {
    chai.expect(() => query.delete().where('id').equals(1).select('test')).to.throw(Error);
  });
  it('Should return a from function', function() {
    let q = query.select('test');
    chai.expect(q).to.have.property('from');
    chai.expect(q.from).to.be.a('function');
  });
  it('Should add a new column to select if the argument is a string', function() {
    query.select('test').from('tests');
    chai.expect(query.selects).to.have.property('columns');
    chai.expect(query.selects.columns).to.include('test');
    chai.expect(query.selects).to.have.property('table');
    chai.expect(query.selects.table).to.equal('tests');
  });
  it('Should ignore non-string or non-array arguments', function() {
    query.select(1).from('tests');
    console.log(query.selects);
    chai.expect(query.selects.columns.length).to.equal(0);
  });
  it('Should add an array of column names to the selects', function() {
    query.select(['test', 'title', 'author']).from('tests');
    chai.expect(query.selects).to.have.property('columns');
    chai.expect(query.selects.columns).to.include('test');
    chai.expect(query.selects.columns).to.include('title');
    chai.expect(query.selects.columns).to.include('author');
    chai.expect(query.selects).to.have.property('table');
    chai.expect(query.selects.table).to.equal('tests');
  });
  it('Should ignore non-string elements of the array', function() {
    query.select(['test', 1, 10]).from('tests');
    chai.expect(query.selects.columns).to.not.include(1);
    chai.expect(query.selects.columns).to.not.include(10);
    chai.expect(query.selects.columns).to.include('test');
  });
  it('Should ignore columns that are already in the array', function() {
    query.select('test').from('tests');
    chai.expect(query.selects.columns.length).to.equal(1);
    query.select('test');
    chai.expect(query.selects.columns.length).to.equal(1);
  });
  it('Should only add new array items', function() {
    query.select('test').from('tests');
    query.select(['test', 'title']).from('tests');
    chai.expect(query.selects.columns.length).to.equal(2);
    chai.expect(query.selects.columns).to.include('test');
    chai.expect(query.selects.columns).to.include('title');
  });
});

describe('Query.where', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should throw an error if a string is not passed', function() {
    chai.expect(() => query.where(1)).to.throw(Error);
  });
  it('Should return an equals function', function() {
    let q = query.where('id');
    chai.expect(q).to.have.property('equals');
    chai.expect(q.equals).to.be.a('function');
    describe('Query.where.equals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.where('id').equals(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.where('id').equals(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('=');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
      });
      it('Should return the query', function() {
        let q = query.where('id').equals(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a notEquals function', function() {
    let q = query.where('id');
    chai.expect(q).to.have.property('notEquals');
    chai.expect(q.notEquals).to.be.a('function');
    describe('Query.where.notEquals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.where('id').notEquals(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.where('id').notEquals(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('!=');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
      });
      it('Should return the query', function() {
        let q = query.where('id').notEquals(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a lessThan function', function() {
    let q = query.where('id');
    chai.expect(q).to.have.property('lessThan');
    chai.expect(q.lessThan).to.be.a('function');

    describe('Query.where.lessThan', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.where('id').lessThan(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.where('id').lessThan(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('<');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
      });
      it('Should return the query', function() {
        let q = query.where('id').lessThan(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a greaterThan function', function() {
    let q = query.where('id');
    chai.expect(q).to.have.property('greaterThan');
    chai.expect(q.greaterThan).to.be.a('function');

    describe('Query.where.greaterThan', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.where('id').greaterThan(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.where('id').greaterThan(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('>');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
      });
      it('Should return the query', function() {
        let q = query.where('id').greaterThan(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a like function', function() {
    let q = query.where('id');
    chai.expect(q).to.have.property('like');
    chai.expect(q.like).to.be.a('function');

    describe('Query.where.like', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.where('id').like(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.where('id').like(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('like');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal('%'+1+'%');
      });
      it('Should return the query', function() {
        let q = query.where('id').like(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a between function', function() {
    describe('Query.where.between', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should return an and function', function() {
        let q = query.where('test').between(1);
        chai.expect(q).to.have.property('and');
        chai.expect(q.and).to.be.a('function');
      });
      it('Should create a valid where object', function() {
        query.where('test').between(1).and(100);
        chai.expect(query.wheres.length).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('test');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('between');
        chai.expect(query.wheres[0]).to.have.property('start');
        chai.expect(query.wheres[0].start).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('end');
        chai.expect(query.wheres[0].end).to.equal(100);
      });
    });
  });
});

describe('Query.andWhere', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should throw an error if a string is not passed', function() {
    chai.expect(() => query.andWhere(1)).to.throw(Error);
  });
  it('Should return an equals function', function() {
    let q = query.andWhere('id');
    chai.expect(q).to.have.property('equals');
    chai.expect(q.equals).to.be.a('function');
    describe('Query.andWhere.equals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.andWhere('id').equals(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').equals(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('=');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').equals(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a notEquals function', function() {
    let q = query.andWhere('id');
    chai.expect(q).to.have.property('notEquals');
    chai.expect(q.notEquals).to.be.a('function');
    describe('Query.andWhere.notEquals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.andWhere('id').notEquals(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').notEquals(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('!=');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').notEquals(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a lessThan function', function() {
    let q = query.andWhere('id');
    chai.expect(q).to.have.property('lessThan');
    chai.expect(q.lessThan).to.be.a('function');

    describe('Query.andWhere.lessThan', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.andWhere('id').lessThan(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').lessThan(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('<');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').lessThan(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a greaterThan function', function() {
    let q = query.andWhere('id');
    chai.expect(q).to.have.property('greaterThan');
    chai.expect(q.greaterThan).to.be.a('function');

    describe('Query.andWhere.greaterThan', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.andWhere('id').greaterThan(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').greaterThan(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('>');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').greaterThan(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a like function', function() {
    let q = query.andWhere('id');
    chai.expect(q).to.have.property('like');
    chai.expect(q.like).to.be.a('function');

    describe('Query.andWhere.like', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.andWhere('id').like(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').like(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('like');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal('%'+1+'%');
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').like(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a between function', function() {
    describe('Query.andWhere.between', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should return an and function', function() {
        let q = query.andWhere('test').between(1);
        chai.expect(q).to.have.property('and');
        chai.expect(q.and).to.be.a('function');
      });
      it('Should create a valid where object', function() {
        query.andWhere('test').between(1).and(100);
        chai.expect(query.wheres.length).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('test');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('between');
        chai.expect(query.wheres[0]).to.have.property('start');
        chai.expect(query.wheres[0].start).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('end');
        chai.expect(query.wheres[0].end).to.equal(100);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
    });
  });
});

describe('Query.orWhere', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should throw an error if a string is not passed', function() {
    chai.expect(() => query.orWhere(1)).to.throw(Error);
  });
  it('Should return an equals function', function() {
    let q = query.orWhere('id');
    chai.expect(q).to.have.property('equals');
    chai.expect(q.equals).to.be.a('function');
    describe('Query.orWhere.equals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.orWhere('id').equals(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').equals(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('=');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').equals(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a orEquals function', function() {
    let q = query.orWhere('id');
    chai.expect(q).to.have.property('notEquals');
    chai.expect(q.notEquals).to.be.a('function');
    describe('Query.orWhere.notEquals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.orWhere('id').notEquals(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').notEquals(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('!=');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').notEquals(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a lessThan function', function() {
    let q = query.orWhere('id');
    chai.expect(q).to.have.property('lessThan');
    chai.expect(q.lessThan).to.be.a('function');

    describe('Query.orWhere.lessThan', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.orWhere('id').lessThan(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').lessThan(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('<');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').lessThan(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a greaterThan function', function() {
    let q = query.orWhere('id');
    chai.expect(q).to.have.property('greaterThan');
    chai.expect(q.greaterThan).to.be.a('function');

    describe('Query.orWhere.greaterThan', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.orWhere('id').greaterThan(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').greaterThan(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('>');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').greaterThan(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a like function', function() {
    let q = query.andWhere('id');
    chai.expect(q).to.have.property('like');
    chai.expect(q.like).to.be.a('function');

    describe('Query.andWhere.like', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have pushed a where clause to the wheres array', function() {
        query.andWhere('id').like(1);
        chai.expect(query.wheres.length).to.equal(1);
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').like(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('id');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('like');
        chai.expect(query.wheres[0]).to.have.property('value');
        chai.expect(query.wheres[0].value).to.equal('%'+1+'%');
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').like(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a between function', function() {
    describe('Query.andWhere.between', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should return an and function', function() {
        let q = query.andWhere('test').between(1);
        chai.expect(q).to.have.property('and');
        chai.expect(q.and).to.be.a('function');
      });
      it('Should create a valid where object', function() {
        query.andWhere('test').between(1).and(100);
        chai.expect(query.wheres.length).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('column');
        chai.expect(query.wheres[0].column).to.equal('test');
        chai.expect(query.wheres[0]).to.have.property('predicate');
        chai.expect(query.wheres[0].predicate).to.equal('between');
        chai.expect(query.wheres[0]).to.have.property('start');
        chai.expect(query.wheres[0].start).to.equal(1);
        chai.expect(query.wheres[0]).to.have.property('end');
        chai.expect(query.wheres[0].end).to.equal(100);
        chai.expect(query.wheres[0]).to.have.property('conditional');
        chai.expect(query.wheres[0].conditional).to.equal('AND');
      });
    });
  });
});

describe('Query.update', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should throw an error if another query type has been started', function() {
    chai.expect(() => query.delete().where('id').equals(1).update('test')).to.throw(Error);
  });
  it('Should throw an error if argument is not a string or an array', function() {
    chai.expect(() => query.update(1)).to.throw(Error);
  });
  it('Should return a function called with if a string is passed', function() {
    let q = query.update('test');
    chai.expect(q).to.have.property('with');
    chai.expect(q.with).to.be.a('function');

    describe('Query.update.with (string)', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should return itself', function() {
        let q = query.update('test').with(1);
        chai.expect(q).to.equal(query);
      });
      it('Should build a valid update object', function() {
        query.update('test').with(1);
        chai.expect(query.updates.length).to.equal(1);
        chai.expect(query.updates[0]).to.have.property('column');
        chai.expect(query.updates[0].column).to.equal('test');
        chai.expect(query.updates[0]).to.have.property('value');
        chai.expect(query.updates[0].value).to.equal(1);
      });
    });
  });
  it('Should return a function called with if an array is passed', function() {
    let q = query.update('test');
    chai.expect(q).to.have.property('with');
    chai.expect(q.with).to.be.a('function');

    describe('Query.update.with (array)', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should return itself', function() {
        let q = query.update(['test', 'id']).with(['foo', 1]);
        chai.expect(q).to.equal(query);
      });
      it('Should throw an error if an array is not passed', function() {
        chai.expect(() => query.update(['test', 'id', 'name']).with(1)).to.throw(Error);
      });
      it('Should throw an error if an array of different length is passed', function() {
        chai.expect(() => query.update(['test', 'id', 'name']).with(['1'])).to.throw(Error);
      });
      it('Should create valid update objects', function() {
        query.update(['test', 'id']).with(['foo', 1]);
        chai.expect(query.updates.length).to.equal(2);
        chai.expect(query.updates[0]).to.have.property('column');
        chai.expect(query.updates[0].column).to.equal('test');
        chai.expect(query.updates[0]).to.have.property('value');
        chai.expect(query.updates[0].value).to.equal('foo');
        chai.expect(query.updates[1]).to.have.property('column');
        chai.expect(query.updates[1].column).to.equal('id');
        chai.expect(query.updates[1]).to.have.property('value');
        chai.expect(query.updates[1].value).to.equal(1);
      });
    });
  });
});

describe('Query.insert', function() {
  let query;
  beforeEach(function() {
    query = new Query();
  });
  it('Should throw an error if another query type has been started', function() {
    chai.expect(() => query.delete().where('id').equals(1).insert({
      'title': 'test'
    })).to.throw(Error);
  });
  it('Should push an insert object an array', function() {
    query.insert({
      title: 'test',
      id: 1
    });
    chai.expect(query.inserts.length).to.equal(1);
  });
  it('Should return itself', function() {
    let q = query.insert({
      title: 'test',
      id: 1
    });
    chai.expect(q).to.equal(query);
  });
});

describe('Query.delete', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should throw an error if another query type has been started', function() {
    chai.expect(() => query.select('id').where('id').equals(1).delete()).to.throw(Error);
  });
  it('Should return a where function', function() {
    let q = query.delete();
    chai.expect(q).to.have.property('where');
    chai.expect(q.where).to.be.a('function');

    describe('Query.delete.where', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });

      it('Should throw an error if the argument is not a string', function() {
        chai.expect(() => query.delete().where(1)).to.throw(Error);
      });
      it('Should return an equals function', function() {
        let q = query.delete().where('id');
        chai.expect(q).to.have.property('equals');
        chai.expect(q.equals).to.be.a('function');
        describe('Query.delete.where.equals', function() {
          let query;
          beforeEach(function(){
            query = new Query();
          });
          it('Should have pushed a delete clause to the delete array', function() {
            query.delete().where('id').equals(1);
            chai.expect(query.deletes.length).to.equal(1);
          });
          it('Should have created a valid where clause object', function() {
            query.delete().where('id').equals(1);
            chai.expect(query.deletes[0]).to.have.property('column');
            chai.expect(query.deletes[0].column).to.equal('id');
            chai.expect(query.deletes[0]).to.have.property('predicate');
            chai.expect(query.deletes[0].predicate).to.equal('=');
            chai.expect(query.deletes[0]).to.have.property('value');
            chai.expect(query.deletes[0].value).to.equal(1);
          });
          it('Should return the query', function() {
            let q = query.delete().where('id').equals(1);
            chai.expect(q).to.equal(query);
          });
        });
      });
      it('Should return a notEquals function', function() {
        let q = query.delete().where('id');
        chai.expect(q).to.have.property('notEquals');
        chai.expect(q.equals).to.be.a('function');
        describe('Query.delete.where.notEquals', function() {
          let query;
          beforeEach(function(){
            query = new Query();
          });
          it('Should have pushed a delete clause to the delete array', function() {
            query.delete().where('id').notEquals(1);
            chai.expect(query.deletes.length).to.equal(1);
          });
          it('Should have created a valid where clause object', function() {
            query.delete().where('id').notEquals(1);
            chai.expect(query.deletes[0]).to.have.property('column');
            chai.expect(query.deletes[0].column).to.equal('id');
            chai.expect(query.deletes[0]).to.have.property('predicate');
            chai.expect(query.deletes[0].predicate).to.equal('!=');
            chai.expect(query.deletes[0]).to.have.property('value');
            chai.expect(query.deletes[0].value).to.equal(1);
          });
          it('Should return the query', function() {
            let q = query.delete().where('id').notEquals(1);
            chai.expect(q).to.equal(query);
          });
        });
      });
      it('Should return a lessThan function', function() {
        let q = query.delete().where('id');
        chai.expect(q).to.have.property('lessThan');
        chai.expect(q.equals).to.be.a('function');
        describe('Query.delete.where.lessThan', function() {
          let query;
          beforeEach(function(){
            query = new Query();
          });
          it('Should have pushed a delete clause to the delete array', function() {
            query.delete().where('id').lessThan(1);
            chai.expect(query.deletes.length).to.equal(1);
          });
          it('Should have created a valid where clause object', function() {
            query.delete().where('id').lessThan(1);
            chai.expect(query.deletes[0]).to.have.property('column');
            chai.expect(query.deletes[0].column).to.equal('id');
            chai.expect(query.deletes[0]).to.have.property('predicate');
            chai.expect(query.deletes[0].predicate).to.equal('<');
            chai.expect(query.deletes[0]).to.have.property('value');
            chai.expect(query.deletes[0].value).to.equal(1);
          });
          it('Should return the query', function() {
            let q = query.delete().where('id').lessThan(1);
            chai.expect(q).to.equal(query);
          });
        });
      });
      it('Should return a greaterThan function', function() {
        let q = query.delete().where('id');
        chai.expect(q).to.have.property('greaterThan');
        chai.expect(q.equals).to.be.a('function');
        describe('Query.delete.where.greaterThan', function() {
          let query;
          beforeEach(function(){
            query = new Query();
          });
          it('Should have pushed a delete clause to the delete array', function() {
            query.delete().where('id').greaterThan(1);
            chai.expect(query.deletes.length).to.equal(1);
          });
          it('Should have created a valid where clause object', function() {
            query.delete().where('id').greaterThan(1);
            chai.expect(query.deletes[0]).to.have.property('column');
            chai.expect(query.deletes[0].column).to.equal('id');
            chai.expect(query.deletes[0]).to.have.property('predicate');
            chai.expect(query.deletes[0].predicate).to.equal('>');
            chai.expect(query.deletes[0]).to.have.property('value');
            chai.expect(query.deletes[0].value).to.equal(1);
          });
          it('Should return the query', function() {
            let q = query.delete().where('id').greaterThan(1);
            chai.expect(q).to.equal(query);
          });
        });
      });
      it('Should return a like function', function() {
        let q = query.delete().where('id');
        chai.expect(q).to.have.property('like');
        chai.expect(q.equals).to.be.a('function');
        describe('Query.delete.where.like', function() {
          let query;
          beforeEach(function(){
            query = new Query();
          });
          it('Should have pushed a delete clause to the delete array', function() {
            query.delete().where('id').like(1);
            chai.expect(query.deletes.length).to.equal(1);
          });
          it('Should have created a valid where clause object', function() {
            query.delete().where('id').like(1);
            chai.expect(query.deletes[0]).to.have.property('column');
            chai.expect(query.deletes[0].column).to.equal('id');
            chai.expect(query.deletes[0]).to.have.property('predicate');
            chai.expect(query.deletes[0].predicate).to.equal('like');
            chai.expect(query.deletes[0]).to.have.property('value');
            chai.expect(query.deletes[0].value).to.equal('%'+1+'%');
          });
          it('Should return the query', function() {
            let q = query.delete().where('id').like(1);
            chai.expect(q).to.equal(query);
          });
        });
      });
    });
  });
});

describe('Query.join', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should throw an error if the argument is not a string', function() {
    chai.expect(() => query.join(1)).to.throw(Error);
  });
  it('Should return a function called on', function() {
    let q = query.join('test');
    chai.expect(q).to.have.property('on');
    chai.expect(q.on).to.be.a('function');

    describe('Query.join.on', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should throw an error if the column name is not a string', function() {
        chai.expect(() => query.join('test').on(1)).to.throw(Error);
      });
      it('Should return an equals function', function() {
        let q = query.join('test').on('test_id');
        chai.expect(q).to.have.property('equals');
        chai.expect(q.equals).to.be.a('function');
      });
    });
  });
  it('Should have created a valid join clause object', function() {

    describe('Query.join.on.equals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have created a valid equals join', function() {
        query.join('test').on('test_id').equals('id');
        chai.expect(query.joins.length).to.equal(1);
        chai.expect(query.joins[0]).to.have.property('type');
        chai.expect(query.joins[0].type).to.equal('INNER');
        chai.expect(query.joins[0]).to.have.property('joinColumn');
        chai.expect(query.joins[0].joinColumn).to.equal('test_id');
        chai.expect(query.joins[0]).to.have.property('table');
        chai.expect(query.joins[0].table).to.equal('test');
        chai.expect(query.joins[0]).to.have.property('predicate');
        chai.expect(query.joins[0].predicate).to.equal('=');
        chai.expect(query.joins[0]).to.have.property('value');
        chai.expect(query.joins[0].value).to.equal('id');
      });
    });
  });
});
