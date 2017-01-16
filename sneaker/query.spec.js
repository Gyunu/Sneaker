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

describe('Query.table', function() {
  it('Should throw an error if the table name has not been defined', function() {
    chai.expect(() => Query.table()).to.throw(Error);
  });
  it('Should throw an error if the table name is not a string', function() {
    chai.expect(() => Query.table(1)).to.throw(Error);
  });
  it('Should return an instance of Query', function() {
    chai.expect(Query.table('test') instanceof Query).to.equal(true);
  });
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
      it('Should have added the column to the where object', function() {
        query.where('id').equals(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('=');
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
      it('Should have added the column to the where object', function() {
        query.where('id').notEquals(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('!=');
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
      it('Should have added the column to the where object', function() {
        query.where('id').lessThan(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('<');
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
      it('Should have added the column to the where object', function() {
        query.where('id').greaterThan(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('>');
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
      it('Should have added the column to the where object', function() {
        query.where('id').like(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal('%'+1+'%');
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('like');
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
      it('Should have added the column to the where object', function() {
        query.where('id').between(1).and(100);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('BETWEEN');
        chai.expect(query.wheres.id).to.have.property('start');
        chai.expect(query.wheres.id.start).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('end');
        chai.expect(query.wheres.id.end).to.equal(100);
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
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').equals(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('=');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('AND');
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
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').notEquals(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('!=');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('AND');
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
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').lessThan(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('<');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('AND');
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
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').greaterThan(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('>');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('AND');
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
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').like(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal('%'+1+'%');
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('like');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('AND');
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
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').between(1).and(100);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('AND');
        chai.expect(query.wheres.id).to.have.property('start');
        chai.expect(query.wheres.id.start).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('end');
        chai.expect(query.wheres.id.end).to.equal(100);
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
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').equals(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('=');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').equals(1);
        chai.expect(q).to.equal(query);
      });
    });
  });
  it('Should return a notEquals function', function() {
    let q = query.orWhere('id');
    chai.expect(q).to.have.property('notEquals');
    chai.expect(q.notEquals).to.be.a('function');
    describe('Query.orWhere.notEquals', function() {
      let query;
      beforeEach(function(){
        query = new Query();
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').notEquals(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('!=');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('OR');
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
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').lessThan(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('<');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('OR');
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
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').greaterThan(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('>');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('OR');
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
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').like(1);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('value');
        chai.expect(query.wheres.id.value).to.equal('%'+1+'%');
        chai.expect(query.wheres.id).to.have.property('predicate');
        chai.expect(query.wheres.id.predicate).to.equal('like');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('OR');
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
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').between(1).and(100);
        chai.expect(query.wheres).to.have.property('id');
        chai.expect(query.wheres.id).to.have.property('conditional');
        chai.expect(query.wheres.id.conditional).to.equal('OR');
        chai.expect(query.wheres.id).to.have.property('start');
        chai.expect(query.wheres.id.start).to.equal(1);
        chai.expect(query.wheres.id).to.have.property('end');
        chai.expect(query.wheres.id.end).to.equal(100);
      });
    });
  });
});

describe('Query.update', function() {
  it('Should throw an error if another query type has been started', function() {
    let query = Query.table('test');
    chai.expect(() => query.delete().where('id').equals(1).update('test')).to.throw(Error);
  });
  it('Should add new columns to the update object', function() {
    let query = Query.table('test');
    query.update({
      'id': 1,
      'title': 'test'
    });

    chai.expect(query.updates).to.have.property('id');
    chai.expect(query.updates.id).to.equal(1);
    chai.expect(query.updates).to.have.property('title');
    chai.expect(query.updates.title).to.equal('test');
  });
  it('Should add more columns with successive update calls', function() {
    let query = Query.table('test');
    query.update({
      'id': 1,
      'title': 'test'
    });

    query.update({
      'copy': 'test copy'
    });

    chai.expect(query.updates).to.have.property('id');
    chai.expect(query.updates.id).to.equal(1);
    chai.expect(query.updates).to.have.property('title');
    chai.expect(query.updates.title).to.equal('test');
    chai.expect(query.updates).to.have.property('copy');
    chai.expect(query.updates.copy).to.equal('test copy');

  });
  it('Should overwrite already set columns with a new value', function() {
    let query = Query.table('test');
    query.update({
      'id': 1,
      'title': 'test'
    });

    query.update({
      'title': 'overwrite'
    });

    chai.expect(query.updates).to.have.property('id');
    chai.expect(query.updates.id).to.equal(1);
    chai.expect(query.updates).to.have.property('title');
    chai.expect(query.updates.title).to.equal('overwrite');
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
  it('Should throw an error if the insert argument is not an array', function() {
    chai.expect(() => query.insert({})).to.throw(Error);
  });
  it('Should push an insert object to the inserts array', function() {
    query.insert([
      {'title': 'test', 'id': 1}
    ]);
    chai.expect(query.inserts.length).to.equal(1);
  });
  it('Should push all insert objects to the inserts array', function() {
    query.insert([
      {'title': 'test', 'id': 1},
      {'title': 'test 2', 'id': 2},
      {'title': 'test 3', 'id': 3},
      {'title': 'test 4', 'id': 4},
      {'title': 'test 5', 'id': 5}
    ]);
    chai.expect(query.inserts.length).to.equal(5);
  });
  it('Should return itself', function() {
    let q = query.insert([
      {'title': 'test', 'id': 2}
    ]);
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
  it('Should return this.where function', function() {
    let q = query.delete();
    chai.expect(q).to.have.property('where');
    chai.expect(q.where).to.be.a('function');
  });
});

describe('Query.buildSQL', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should return an object', function() {
    query.select('id').from('tests').where('id').equals(1);
    let build = query.buildSQL();
    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql).to.be.a('string');
    chai.expect(build).to.have.property('binds');
  });
  it('Should return a correct select and where clause (SELECT equals)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' = :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('id').equals(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT notEquals)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' != :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('id').notEquals(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT greaterThan)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' > :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('id').greaterThan(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT lessThan)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' < :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('id').lessThan(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT like)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'title' like :tests_title`;
    let build = query.select(['id', 'title']).from('tests').where('title').like('test').buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('%test%');
  });
  it('Should return a correct select and whereBetween clause (SELECT whereBetween)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' BETWEEN :tests_id_start AND :tests_id_end`;
    let build = query.select(['id', 'title']).from('tests').where('id').between(1).and(100).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id_start');
    chai.expect(build.binds[':tests_id_start']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_id_end');
    chai.expect(build.binds[':tests_id_end']).to.equal(100);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere equals)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' = :tests_id AND tests.'title' = :tests_title`;
    let build = query.select(['id', 'title']).from('tests').where('id').equals(1).andWhere('title').equals('test').buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');

  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere notEquals)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' = :tests_id AND tests.'title' != :tests_title`;
    let build = query.select(['id', 'title']).from('tests').where('id').equals(1).andWhere('title').notEquals('test').buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere greaterThan)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'title' = :tests_title AND tests.'id' > :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('title').equals('test').andWhere('id').greaterThan(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere lessThan)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'title' = :tests_title AND tests.'id' < :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('title').equals('test').andWhere('id').lessThan(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere like)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'title' = :tests_title AND tests.'id' like :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('title').equals('test').andWhere('id').like(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal('%1%');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere equals)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' = :tests_id OR tests.'title' = :tests_title`;
    let build = query.select(['id', 'title']).from('tests').where('id').equals(1).orWhere('title').equals('test').buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere notEquals)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'id' = :tests_id OR tests.'title' != :tests_title`;
    let build = query.select(['id', 'title']).from('tests').where('id').equals(1).orWhere('title').notEquals('test').buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere greaterThan)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'title' = :tests_title OR tests.'id' > :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('title').equals('test').orWhere('id').greaterThan(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere lessThan)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'title' = :tests_title OR tests.'id' < :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('title').equals('test').orWhere('id').lessThan(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere like)', function() {
    let sql = `SELECT tests.'id', tests.'title' FROM tests WHERE tests.'title' = :tests_title OR tests.'id' like :tests_id`;
    let build = query.select(['id', 'title']).from('tests').where('title').equals('test').orWhere('id').like(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal('%1%');
  });
  it('Should return a correct select and where, andwhere, andwhere clause (SELECT equals andWhere equals andWhere greaterThan)', function() {
    let sql = `SELECT tests.'id' FROM tests WHERE tests.'title' = :tests_title AND tests.'author' = :tests_author AND tests.'id' > :tests_id`;
    let build = query.select('id').from('tests').where('title').equals('test').andWhere('author').equals('dave').andWhere('id').greaterThan(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
    chai.expect(build.binds).to.have.property(':tests_author');
    chai.expect(build.binds[':tests_author']).to.equal('dave');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct SQL Update statement', function() {
    let sql = `UPDATE test SET test.'id' = :update_id, test.'title' = :update_title WHERE test.'id' = :test_id`;
    let build = Query.table('test').update({
      'id': 1,
      'title': 'test'
    }).where('id').equals(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
  });
  it('Should return a correct SQL Insert statement', function() {
    let sql = `INSERT INTO test (column_1, column_2) VALUES (:insert_column_1_0, :insert_column_2_0)`;

    let build = Query.table('test').insert([
      {column_1: 'test', column_2: 'test_1'}
    ]).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
  });
  it('Should return a correct SQL Delete statement', function() {
    let sql = `DELETE FROM test WHERE test.'id' = :test_id`;
    let build = Query.table('test').delete().where('id').equals(1).buildSQL();

    chai.expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.buildSelectSQL', function() {
  let query;
  beforeEach(function(){
    query = new Query();
  });
  it('Should return a string', function() {
    query.select('id').from('tests').where('id').equals(1);
    chai.expect(query.buildSelectSQL()).to.be.a('string');
  });
  it('Should return a correct SQL Select statement (string)', function() {
    query.select('id').from('tests').where('id').equals(1);
    let sql = `SELECT tests.'id' FROM tests`;
    chai.expect(query.buildSelectSQL() == sql).to.equal(true);
  });
  it('Should return a correct SQL Select statement (array)', function() {
    let query = new Query().select(['id', 'test', 'title']).from('tests').where('id').equals(1);
    let sql = `SELECT tests.'id', tests.'test', tests.'title' FROM tests`;
    chai.expect(query.buildSelectSQL() == sql).to.equal(true);
  });
});

describe('Query.buildWhereSQL', function() {
  let query;
  beforeEach(function() {
    query = new Query();
  });
  it('Should return an object with sql and binds', function() {
    query.select('id').from('tests').where('id').equals(1);

    let build = query.buildWhereSQL();
    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql).to.be.a('string');
    chai.expect(build).to.have.property('binds');
  });
  it('Should return a correct SQL Where statement (equals)', function() {
    let sql = `WHERE tests.'id' = :tests_id`;
    query.select('id').from('tests').where('id').equals(1);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);

  });
  it('Should return a correct SQL Where statement (notEquals)', function() {
    let sql = `WHERE tests.'id' != :tests_id`;
    query.select('id').from('tests').where('id').notEquals(1);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);

  });
  it('Should return a correct SQL Where statement (greaterThan)', function() {
    let sql = `WHERE tests.'id' > :tests_id`;
    query.select('id').from('tests').where('id').greaterThan(1);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct SQL Where statement (lessthan)', function() {
    let sql = `WHERE tests.'id' < :tests_id`;
    query.select('id').from('tests').where('id').lessThan(1);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
  });
  it('Should return a correct SQL Where statement (like)', function() {
    let sql = `WHERE tests.'id' like :tests_id`;
    query.select('id').from('tests').where('id').like(1);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal('%1%');
  });
  it('Should return a correct SQL Where statement (andWhere equals)', function() {
    let sql = `WHERE tests.'id' = :tests_id AND tests.'title' = :tests_title`;
    query.select('id').from('tests').where('id').equals(1).andWhere('title').equals('test');

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (andWhere notEquals)', function() {
    let sql = `WHERE tests.'id' = :tests_id AND tests.'title' != :tests_title`;
    query.select('id').from('tests').where('id').equals(1).andWhere('title').notEquals('test');

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (andWhere lessThan)', function() {
    let sql = `WHERE tests.'id' = :tests_id AND tests.'title' < :tests_title`;
    query.select('id').from('tests').where('id').equals(1).andWhere('title').lessThan(100);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal(100);
  });
  it('Should return a correct SQL Where statement (andWhere like)', function() {
    let sql = `WHERE tests.'id' = :tests_id AND tests.'title' like :tests_title`;
    query.select('id').from('tests').where('id').equals(1).andWhere('title').like('test');

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('%test%');
  });

  it('Should return a correct SQL Where statement (orWhere equals)', function() {
    let sql = `WHERE tests.'id' = :tests_id OR tests.'title' = :tests_title`;
    query.select('id').from('tests').where('id').equals(1).orWhere('title').equals('test');

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (orWhere notEquals)', function() {
    let sql = `WHERE tests.'id' = :tests_id OR tests.'title' != :tests_title`;
    query.select('id').from('tests').where('id').equals(1).orWhere('title').notEquals('test');

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (orWhere lessThan)', function() {
    let sql = `WHERE tests.'id' = :tests_id OR tests.'title' < :tests_title`;
    query.select('id').from('tests').where('id').equals(1).orWhere('title').lessThan(100);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal(100);
  });
  it('Should return a correct SQL Where statement (orWhere like)', function() {
    let sql = `WHERE tests.'id' = :tests_id OR tests.'title' like :tests_title`;
    query.select('id').from('tests').where('id').equals(1).orWhere('title').like('test');

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id');
    chai.expect(build.binds[':tests_id']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_title');
    chai.expect(build.binds[':tests_title']).to.equal('%test%');
  });
  it('Should return a correct SQL Where statement (whereBetween)', function() {
    let sql = `WHERE tests.'id' BETWEEN :tests_id_start AND :tests_id_end`;
    query.select('id').from('tests').where('id').between(1).and(100);

    let build = query.buildWhereSQL();

    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql == sql).to.equal(true);
    chai.expect(build).to.have.property('binds');
    chai.expect(build.binds).to.have.property(':tests_id_start');
    chai.expect(build.binds[':tests_id_start']).to.equal(1);
    chai.expect(build.binds).to.have.property(':tests_id_end');
    chai.expect(build.binds[':tests_id_end']).to.equal(100);
  });
});

describe('Query.buildUpdateSQL', function() {
  let query;
  beforeEach(function() {
    query = Query.table('test');
  });
  it('Should return an object with binds and sql', function() {
    let build = query.update({
      column_1: 'test',
      column_2: 'test_1'
    }).where('id').equals(1).buildUpdateSQL();

    chai.expect(build).to.have.property('binds');
    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql).to.be.a('string');
    chai.expect(build.binds).to.be.an('object');
  });
  it('Should return a valid SQL update statement', function() {
    let sql = `UPDATE test SET test.'column_1' = :update_column_1, test.'column_2' = :update_column_2`;
    let build = query.update({
      'column_1': 'test',
      'column_2': 'test_2'
    }).where('id').equals(1).buildUpdateSQL();

    chai.expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.buildInsertSQL', function() {
  let query;
  beforeEach(function() {
    query = Query.table('test');
  });
  it('Should return an object', function() {
    query.insert([{
      'id': 1,
      'title': 'test',
      'copy': 'test copy'
    }]);
    let build = query.buildInsertSQL();
    chai.expect(build).to.have.property('binds');
    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql).to.be.a('string');
    chai.expect(build.binds).to.be.an('object');
  });
  it('Should return a valid SQL insert statement (single)', function() {
    let sql = `INSERT INTO test (id, title, copy) VALUES (:insert_id_0, :insert_title_0, :insert_copy_0)`;
    query.insert([{
      'id': 1,
      'title': 'test',
      'copy': 'test copy'
    }]);

    let build = query.buildInsertSQL();
    chai.expect(build.sql == sql).to.equal(true);
  });
  it('Should return a valid SQL insert statement (array)', function() {
    let sql = `INSERT INTO test (id, title, copy) VALUES (:insert_id_0, :insert_title_0, :insert_copy_0), (:insert_id_1, :insert_title_1, :insert_copy_1)`;
    query.insert([
      {'id': 1, 'title': 'test', 'copy': 'test copy'},
      {'id': 2, 'title': 'test_2', 'copy': 'test copy 2'}
    ]);

    let build = query.buildInsertSQL();
    chai.expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.buildDeleteSQL', function() {
  let query;
  beforeEach(function() {
    query = Query.table('test');
  });
  it('Should return an object with an sql property', function() {
    query.delete().where('id').equals(1);
    let build = query.buildDeleteSQL();
    chai.expect(build).to.have.property('sql');
    chai.expect(build.sql).to.be.a('string');
  });
  it('Should return a valid SQL delete statement', function() {
    let sql = `DELETE FROM test`;
    query.delete().where('id').equals(1);

    let build = query.buildDeleteSQL();
    chai.expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.get', function() {

});
