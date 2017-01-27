let chai = require('chai');
let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
let sinon = require('sinon');

let Query = require('./query');

chai.use(chaiAsPromised);

describe('Query', function() {

});

describe('Query.database', function() {
  it('Should throw an error if the database name has not been defined', function() {
    expect(() => Query.database()).to.throw(Error);
  });
  it('Should throw an error if the database name is not a string', function() {
    expect(() => Query.database(1)).to.throw(Error);
  });
  it('Should return a table function', function() {
    expect(Query.database('test')).to.have.property('table');
    expect(Query.database('test').table).to.be.a('function');
  });
});

describe('Query.database.table', function() {
  it('Should throw an error if the table name is not defined', function() {
    expect(() => Query.database('test').table()).to.throw(Error);
  });
  it('Should throw an error if the table name is not a string', function() {
    expect(() => Query.database('test').table(1)).to.throw(Error);
  });
  it('Should return an instance of itself', function() {
    let q = Query.database('test').table('articles');
    expect(q instanceof Query).to.equal(true);
  });
});

describe('Query.select', function() {
  let query;
  beforeEach(function(){
    query = Query.database('test').table('articles');
  });
  it('Should throw an error if another query type has been started', function() {
    expect(() => query.delete().where('id').equals(1).select('test')).to.throw(Error);
  });
  it('Should add a new column to select if the argument is a string', function() {
    query.select('test');
    expect(query.selects).to.have.property('columns');
    expect(query.selects.columns).to.include('test');
  });
  it('Should ignore non-string or non-array arguments', function() {
    query.select(1);
    expect(query.selects.columns.length).to.equal(0);
  });
  it('Should add an array of column names to the selects', function() {
    query.select(['test', 'title', 'author']);
    expect(query.selects).to.have.property('columns');
    expect(query.selects.columns).to.include('test');
    expect(query.selects.columns).to.include('title');
    expect(query.selects.columns).to.include('author');
  });
  it('Should ignore non-string elements of the array', function() {
    query.select(['test', 1, 10]);
    expect(query.selects.columns).to.not.include(1);
    expect(query.selects.columns).to.not.include(10);
    expect(query.selects.columns).to.include('test');
  });
  it('Should ignore columns that are already in the array', function() {
    query.select('test');
    expect(query.selects.columns.length).to.equal(1);
    query.select('test');
    expect(query.selects.columns.length).to.equal(1);
  });
  it('Should only add new array items', function() {
    query.select('test');
    query.select(['test', 'title']);
    expect(query.selects.columns.length).to.equal(2);
    expect(query.selects.columns).to.include('test');
    expect(query.selects.columns).to.include('title');
  });
});

describe('Query.where', function() {
  let query;
  beforeEach(function(){
    query = Query.database('test').table('articles');
  });
  it('Should throw an error if a string is not passed', function() {
    expect(() => query.where(1)).to.throw(Error);
  });
  it('Should return an equals function', function() {
    let q = query.where('id');
    expect(q).to.have.property('equals');
    expect(q.equals).to.be.a('function');
    describe('Query.where.equals', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have added the column to the where object', function() {
        query.where('id').equals(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('=');
      });
      it('Should return the query', function() {
        let q = query.where('id').equals(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a notEquals function', function() {
    let q = query.where('id');
    expect(q).to.have.property('notEquals');
    expect(q.notEquals).to.be.a('function');
    describe('Query.where.notEquals', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have added the column to the where object', function() {
        query.where('id').notEquals(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('!=');
      });
      it('Should return the query', function() {
        let q = query.where('id').notEquals(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a lessThan function', function() {
    let q = query.where('id');
    expect(q).to.have.property('lessThan');
    expect(q.lessThan).to.be.a('function');

    describe('Query.where.lessThan', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have added the column to the where object', function() {
        query.where('id').lessThan(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('<');
      });
      it('Should return the query', function() {
        let q = query.where('id').lessThan(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a greaterThan function', function() {
    let q = query.where('id');
    expect(q).to.have.property('greaterThan');
    expect(q.greaterThan).to.be.a('function');

    describe('Query.where.greaterThan', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have added the column to the where object', function() {
        query.where('id').greaterThan(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('>');
      });
      it('Should return the query', function() {
        let q = query.where('id').greaterThan(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a like function', function() {
    let q = query.where('id');
    expect(q).to.have.property('like');
    expect(q.like).to.be.a('function');

    describe('Query.where.like', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have added the column to the where object', function() {
        query.where('id').like(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal('%'+1+'%');
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('like');
      });
      it('Should return the query', function() {
        let q = query.where('id').like(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a between function', function() {
    describe('Query.where.between', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should return an and function', function() {
        let q = query.where('test').between(1);
        expect(q).to.have.property('and');
        expect(q.and).to.be.a('function');
      });
      it('Should have added the column to the where object', function() {
        query.where('id').between(1).and(100);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('BETWEEN');
        expect(query.wheres.id).to.have.property('start');
        expect(query.wheres.id.start).to.equal(1);
        expect(query.wheres.id).to.have.property('end');
        expect(query.wheres.id.end).to.equal(100);
      });
    });
  });
});

describe('Query.andWhere', function() {
  let query;
  beforeEach(function(){
    query = Query.database('test').table('articles');
  });
  it('Should throw an error if a string is not passed', function() {
    expect(() => query.andWhere(1)).to.throw(Error);
  });
  it('Should return an equals function', function() {
    let q = query.andWhere('id');
    expect(q).to.have.property('equals');
    expect(q.equals).to.be.a('function');
    describe('Query.andWhere.equals', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').equals(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('=');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').equals(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a notEquals function', function() {
    let q = query.andWhere('id');
    expect(q).to.have.property('notEquals');
    expect(q.notEquals).to.be.a('function');
    describe('Query.andWhere.notEquals', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').notEquals(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('!=');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').notEquals(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a lessThan function', function() {
    let q = query.andWhere('id');
    expect(q).to.have.property('lessThan');
    expect(q.lessThan).to.be.a('function');

    describe('Query.andWhere.lessThan', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').lessThan(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('<');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').lessThan(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a greaterThan function', function() {
    let q = query.andWhere('id');
    expect(q).to.have.property('greaterThan');
    expect(q.greaterThan).to.be.a('function');

    describe('Query.andWhere.greaterThan', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').greaterThan(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('>');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').greaterThan(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a like function', function() {
    let q = query.andWhere('id');
    expect(q).to.have.property('like');
    expect(q.like).to.be.a('function');

    describe('Query.andWhere.like', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').like(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal('%'+1+'%');
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('like');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('AND');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').like(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a between function', function() {
    describe('Query.andWhere.between', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should return an and function', function() {
        let q = query.andWhere('test').between(1);
        expect(q).to.have.property('and');
        expect(q.and).to.be.a('function');
      });
      it('Should have created a valid where clause object', function() {
        query.andWhere('id').between(1).and(100);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('AND');
        expect(query.wheres.id).to.have.property('start');
        expect(query.wheres.id.start).to.equal(1);
        expect(query.wheres.id).to.have.property('end');
        expect(query.wheres.id.end).to.equal(100);
      });
    });
  });
});

describe('Query.orWhere', function() {
  let query;
  beforeEach(function(){
    query = Query.database('test').table('articles');
  });
  it('Should throw an error if a string is not passed', function() {
    expect(() => query.orWhere(1)).to.throw(Error);
  });
  it('Should return an equals function', function() {
    let q = query.orWhere('id');
    expect(q).to.have.property('equals');
    expect(q.equals).to.be.a('function');
    describe('Query.orWhere.equals', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').equals(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('=');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').equals(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a notEquals function', function() {
    let q = query.orWhere('id');
    expect(q).to.have.property('notEquals');
    expect(q.notEquals).to.be.a('function');
    describe('Query.orWhere.notEquals', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').notEquals(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('!=');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').notEquals(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a lessThan function', function() {
    let q = query.orWhere('id');
    expect(q).to.have.property('lessThan');
    expect(q.lessThan).to.be.a('function');

    describe('Query.orWhere.lessThan', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').lessThan(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('<');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').lessThan(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a greaterThan function', function() {
    let q = query.orWhere('id');
    expect(q).to.have.property('greaterThan');
    expect(q.greaterThan).to.be.a('function');

    describe('Query.orWhere.greaterThan', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').greaterThan(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal(1);
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('>');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.orWhere('id').greaterThan(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a like function', function() {
    let q = query.andWhere('id');
    expect(q).to.have.property('like');
    expect(q.like).to.be.a('function');

    describe('Query.andWhere.like', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').like(1);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('value');
        expect(query.wheres.id.value).to.equal('%'+1+'%');
        expect(query.wheres.id).to.have.property('predicate');
        expect(query.wheres.id.predicate).to.equal('like');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('OR');
      });
      it('Should return the query', function() {
        let q = query.andWhere('id').like(1);
        expect(q).to.equal(query);
      });
    });
  });
  it('Should return a between function', function() {
    describe('Query.andWhere.between', function() {
      let query;
      beforeEach(function(){
        query = Query.database('test').table('articles');
      });
      it('Should return an and function', function() {
        let q = query.andWhere('test').between(1);
        expect(q).to.have.property('and');
        expect(q.and).to.be.a('function');
      });
      it('Should have created a valid where clause object', function() {
        query.orWhere('id').between(1).and(100);
        expect(query.wheres).to.have.property('id');
        expect(query.wheres.id).to.have.property('conditional');
        expect(query.wheres.id.conditional).to.equal('OR');
        expect(query.wheres.id).to.have.property('start');
        expect(query.wheres.id.start).to.equal(1);
        expect(query.wheres.id).to.have.property('end');
        expect(query.wheres.id.end).to.equal(100);
      });
    });
  });
});

describe('Query.update', function() {
  it('Should throw an error if another query type has been started', function() {
    let query = Query.database('test').table('articles');
    expect(() => query.delete().where('id').equals(1).update('test')).to.throw(Error);
  });
  it('Should add new columns to the update object', function() {
    let query = Query.database('test').table('articles');
    query.update({
      'id': 1,
      'title': 'test'
    });

    expect(query.updates).to.have.property('id');
    expect(query.updates.id).to.equal(1);
    expect(query.updates).to.have.property('title');
    expect(query.updates.title).to.equal('test');
  });
  it('Should add more columns with successive update calls', function() {
    let query = Query.database('test').table('articles');
    query.update({
      'id': 1,
      'title': 'test'
    });

    query.update({
      'copy': 'test copy'
    });

    expect(query.updates).to.have.property('id');
    expect(query.updates.id).to.equal(1);
    expect(query.updates).to.have.property('title');
    expect(query.updates.title).to.equal('test');
    expect(query.updates).to.have.property('copy');
    expect(query.updates.copy).to.equal('test copy');

  });
  it('Should overwrite already set columns with a new value', function() {
    let query = Query.database('test').table('articles');
    query.update({
      'id': 1,
      'title': 'test'
    });

    query.update({
      'title': 'overwrite'
    });

    expect(query.updates).to.have.property('id');
    expect(query.updates.id).to.equal(1);
    expect(query.updates).to.have.property('title');
    expect(query.updates.title).to.equal('overwrite');
  });
});

describe('Query.insert', function() {
  let query;
  beforeEach(function() {
    query = Query.database('test').table('articles');
  });
  it('Should throw an error if another query type has been started', function() {
    expect(() => query.delete().where('id').equals(1).insert({
      'title': 'test'
    })).to.throw(Error);
  });
  it('Should throw an error if the insert argument is not an array', function() {
    expect(() => query.insert({})).to.throw(Error);
  });
  it('Should push an insert object to the inserts array', function() {
    query.insert([
      {'title': 'test', 'id': 1}
    ]);
    expect(query.inserts.length).to.equal(1);
  });
  it('Should push all insert objects to the inserts array', function() {
    query.insert([
      {'title': 'test', 'id': 1},
      {'title': 'test 2', 'id': 2},
      {'title': 'test 3', 'id': 3},
      {'title': 'test 4', 'id': 4},
      {'title': 'test 5', 'id': 5}
    ]);
    expect(query.inserts.length).to.equal(5);
  });
  it('Should return itself', function() {
    let q = query.insert([
      {'title': 'test', 'id': 2}
    ]);
    expect(q).to.equal(query);
  });
});

describe('Query.delete', function() {
  let query;
  beforeEach(function(){
    query = Query.database('test').table('articles');
  });
  it('Should throw an error if another query type has been started', function() {
    expect(() => query.select('id').where('id').equals(1).delete()).to.throw(Error);
  });
  it('Should return this.where function', function() {
    let q = query.delete();
    expect(q).to.have.property('where');
    expect(q.where).to.be.a('function');
  });
});

describe('Query.buildSQL', function() {
  let query;
  beforeEach(function(){
    query = Query.database('test').table('articles');
  });
  it('Should return an object', function() {
    query.select('id').where('id').equals(1);
    let build = query.buildSQL();
    expect(build).to.have.property('sql');
    expect(build.sql).to.be.a('string');
    expect(build).to.have.property('binds');
  });
  it('Should return a correct select and where clause (SELECT equals)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' = :articles_id`;
    let build = query.select(['id', 'title']).where('id').equals(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT notEquals)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' != :articles_id`;
    let build = query.select(['id', 'title']).where('id').notEquals(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT greaterThan)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' > :articles_id`;
    let build = query.select(['id', 'title']).where('id').greaterThan(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT lessThan)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' < :articles_id`;
    let build = query.select(['id', 'title']).where('id').lessThan(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where clause (SELECT like)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'title' like :articles_title`;
    let build = query.select(['id', 'title']).where('title').like('test').buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('%test%');
  });
  it('Should return a correct select and whereBetween clause (SELECT whereBetween)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' BETWEEN :articles_id_start AND :articles_id_end`;
    let build = query.select(['id', 'title']).where('id').between(1).and(100).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id_start');
    expect(build.binds[':articles_id_start']).to.equal(1);
    expect(build.binds).to.have.property(':articles_id_end');
    expect(build.binds[':articles_id_end']).to.equal(100);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere equals)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' = :articles_id AND articles.'title' = :articles_title`;
    let build = query.select(['id', 'title']).where('id').equals(1).andWhere('title').equals('test').buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');

  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere notEquals)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' = :articles_id AND articles.'title' != :articles_title`;
    let build = query.select(['id', 'title']).where('id').equals(1).andWhere('title').notEquals('test').buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere greaterThan)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'title' = :articles_title AND articles.'id' > :articles_id`;
    let build = query.select(['id', 'title']).where('title').equals('test').andWhere('id').greaterThan(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere lessThan)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'title' = :articles_title AND articles.'id' < :articles_id`;
    let build = query.select(['id', 'title']).where('title').equals('test').andWhere('id').lessThan(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals andWhere like)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'title' = :articles_title AND articles.'id' like :articles_id`;
    let build = query.select(['id', 'title']).where('title').equals('test').andWhere('id').like(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal('%1%');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere equals)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' = :articles_id OR articles.'title' = :articles_title`;
    let build = query.select(['id', 'title']).where('id').equals(1).orWhere('title').equals('test').buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere notEquals)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'id' = :articles_id OR articles.'title' != :articles_title`;
    let build = query.select(['id', 'title']).where('id').equals(1).orWhere('title').notEquals('test').buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere greaterThan)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'title' = :articles_title OR articles.'id' > :articles_id`;
    let build = query.select(['id', 'title']).where('title').equals('test').orWhere('id').greaterThan(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere lessThan)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'title' = :articles_title OR articles.'id' < :articles_id`;
    let build = query.select(['id', 'title']).where('title').equals('test').orWhere('id').lessThan(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct select and where, andWhere clause (SELECT equals orWhere like)', function() {
    let sql = `SELECT articles.'id', articles.'title' FROM articles WHERE articles.'title' = :articles_title OR articles.'id' like :articles_id`;
    let build = query.select(['id', 'title']).where('title').equals('test').orWhere('id').like(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal('%1%');
  });
  it('Should return a correct select and where, andwhere, andwhere clause (SELECT equals andWhere equals andWhere greaterThan)', function() {
    let sql = `SELECT articles.'id' FROM articles WHERE articles.'title' = :articles_title AND articles.'author' = :articles_author AND articles.'id' > :articles_id`;
    let build = query.select('id').where('title').equals('test').andWhere('author').equals('dave').andWhere('id').greaterThan(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
    expect(build.binds).to.have.property(':articles_author');
    expect(build.binds[':articles_author']).to.equal('dave');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct SQL Update statement', function() {
    let sql = `UPDATE articles SET articles.'id' = :update_id, articles.'title' = :update_title WHERE articles.'id' = :articles_id`;
    let build = Query.database('test').table('articles').update({
      'id': 1,
      'title': 'test'
    }).where('id').equals(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
  });
  it('Should return a correct SQL Insert statement', function() {
    let sql = `INSERT INTO articles (column_1, column_2) VALUES (:insert_column_1_0, :insert_column_2_0)`;

    let build = Query.database('test').table('articles').insert([
      {column_1: 'test', column_2: 'test_1'}
    ]).buildSQL();

    expect(build.sql == sql).to.equal(true);
  });
  it('Should return a correct SQL Delete statement', function() {
    let sql = `DELETE FROM articles WHERE articles.'id' = :articles_id`;
    let build = Query.database('test').table('articles').delete().where('id').equals(1).buildSQL();

    expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.buildSelectSQL', function() {
  let query;
  beforeEach(function(){
    query = Query.database('test').table('articles');
  });
  it('Should return a string', function() {
    query.select('id').where('id').equals(1);
    expect(query.buildSelectSQL()).to.be.a('string');
  });
  it('Should return a correct SQL Select statement (string)', function() {
    query.select('id').where('id').equals(1);
    let sql = `SELECT articles.'id' FROM articles`;
    expect(query.buildSelectSQL() == sql).to.equal(true);
  });
  it('Should return a correct SQL Select statement (array)', function() {
    let q = query.select(['id', 'test', 'title']).where('id').equals(1);
    let sql = `SELECT articles.'id', articles.'test', articles.'title' FROM articles`;
    expect(q.buildSelectSQL() == sql).to.equal(true);
  });
});

describe('Query.buildWhereSQL', function() {
  let query;
  beforeEach(function() {
    query = Query.database('test').table('articles');
  });
  it('Should return an object with sql and binds', function() {
    query.select('id').where('id').equals(1);

    let build = query.buildWhereSQL();
    expect(build).to.have.property('sql');
    expect(build.sql).to.be.a('string');
    expect(build).to.have.property('binds');
  });
  it('Should return a correct SQL Where statement (equals)', function() {
    let sql = `WHERE articles.'id' = :articles_id`;
    query.select('id').where('id').equals(1);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);

  });
  it('Should return a correct SQL Where statement (notEquals)', function() {
    let sql = `WHERE articles.'id' != :articles_id`;
    query.select('id').where('id').notEquals(1);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);

  });
  it('Should return a correct SQL Where statement (greaterThan)', function() {
    let sql = `WHERE articles.'id' > :articles_id`;
    query.select('id').where('id').greaterThan(1);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct SQL Where statement (lessthan)', function() {
    let sql = `WHERE articles.'id' < :articles_id`;
    query.select('id').where('id').lessThan(1);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
  });
  it('Should return a correct SQL Where statement (like)', function() {
    let sql = `WHERE articles.'id' like :articles_id`;
    query.select('id').where('id').like(1);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal('%1%');
  });
  it('Should return a correct SQL Where statement (andWhere equals)', function() {
    let sql = `WHERE articles.'id' = :articles_id AND articles.'title' = :articles_title`;
    query.select('id').where('id').equals(1).andWhere('title').equals('test');

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (andWhere notEquals)', function() {
    let sql = `WHERE articles.'id' = :articles_id AND articles.'title' != :articles_title`;
    query.select('id').where('id').equals(1).andWhere('title').notEquals('test');

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (andWhere lessThan)', function() {
    let sql = `WHERE articles.'id' = :articles_id AND articles.'title' < :articles_title`;
    query.select('id').where('id').equals(1).andWhere('title').lessThan(100);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal(100);
  });
  it('Should return a correct SQL Where statement (andWhere like)', function() {
    let sql = `WHERE articles.'id' = :articles_id AND articles.'title' like :articles_title`;
    query.select('id').where('id').equals(1).andWhere('title').like('test');

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('%test%');
  });

  it('Should return a correct SQL Where statement (orWhere equals)', function() {
    let sql = `WHERE articles.'id' = :articles_id OR articles.'title' = :articles_title`;
    query.select('id').where('id').equals(1).orWhere('title').equals('test');

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (orWhere notEquals)', function() {
    let sql = `WHERE articles.'id' = :articles_id OR articles.'title' != :articles_title`;
    query.select('id').where('id').equals(1).orWhere('title').notEquals('test');

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('test');
  });
  it('Should return a correct SQL Where statement (orWhere lessThan)', function() {
    let sql = `WHERE articles.'id' = :articles_id OR articles.'title' < :articles_title`;
    query.select('id').where('id').equals(1).orWhere('title').lessThan(100);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal(100);
  });
  it('Should return a correct SQL Where statement (orWhere like)', function() {
    let sql = `WHERE articles.'id' = :articles_id OR articles.'title' like :articles_title`;
    query.select('id').where('id').equals(1).orWhere('title').like('test');

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id');
    expect(build.binds[':articles_id']).to.equal(1);
    expect(build.binds).to.have.property(':articles_title');
    expect(build.binds[':articles_title']).to.equal('%test%');
  });
  it('Should return a correct SQL Where statement (whereBetween)', function() {
    let sql = `WHERE articles.'id' BETWEEN :articles_id_start AND :articles_id_end`;
    query.select('id').where('id').between(1).and(100);

    let build = query.buildWhereSQL();

    expect(build).to.have.property('sql');
    expect(build.sql == sql).to.equal(true);
    expect(build).to.have.property('binds');
    expect(build.binds).to.have.property(':articles_id_start');
    expect(build.binds[':articles_id_start']).to.equal(1);
    expect(build.binds).to.have.property(':articles_id_end');
    expect(build.binds[':articles_id_end']).to.equal(100);
  });
});

describe('Query.buildUpdateSQL', function() {
  let query;
  beforeEach(function() {
    query = Query.database('test').table('articles');
  });
  it('Should return an object with binds and sql', function() {
    let build = query.update({
      column_1: 'test',
      column_2: 'test_1'
    }).where('id').equals(1).buildUpdateSQL();

    expect(build).to.have.property('binds');
    expect(build).to.have.property('sql');
    expect(build.sql).to.be.a('string');
    expect(build.binds).to.be.an('object');
  });
  it('Should return a valid SQL update statement', function() {
    let sql = `UPDATE articles SET articles.'column_1' = :update_column_1, articles.'column_2' = :update_column_2`;
    let build = query.update({
      'column_1': 'test',
      'column_2': 'test_2'
    }).where('id').equals(1).buildUpdateSQL();

    expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.buildInsertSQL', function() {
  let query;
  beforeEach(function() {
    query = Query.database('test').table('articles');
  });
  it('Should return an object', function() {
    query.insert([{
      'id': 1,
      'title': 'test',
      'copy': 'test copy'
    }]);
    let build = query.buildInsertSQL();
    expect(build).to.have.property('binds');
    expect(build).to.have.property('sql');
    expect(build.sql).to.be.a('string');
    expect(build.binds).to.be.an('object');
  });
  it('Should return a valid SQL insert statement (single)', function() {
    let sql = `INSERT INTO articles (id, title, copy) VALUES (:insert_id_0, :insert_title_0, :insert_copy_0)`;
    query.insert([{
      'id': 1,
      'title': 'test',
      'copy': 'test copy'
    }]);

    let build = query.buildInsertSQL();
    expect(build.sql == sql).to.equal(true);
  });
  it('Should return a valid SQL insert statement (array)', function() {
    let sql = `INSERT INTO articles (id, title, copy) VALUES (:insert_id_0, :insert_title_0, :insert_copy_0), (:insert_id_1, :insert_title_1, :insert_copy_1)`;
    query.insert([
      {'id': 1, 'title': 'test', 'copy': 'test copy'},
      {'id': 2, 'title': 'test_2', 'copy': 'test copy 2'}
    ]);

    let build = query.buildInsertSQL();
    expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.buildDeleteSQL', function() {
  let query;
  beforeEach(function() {
    query = Query.database('test').table('articles');
  });
  it('Should return an object with an sql property', function() {
    query.delete().where('id').equals(1);
    let build = query.buildDeleteSQL();
    expect(build).to.have.property('sql');
    expect(build.sql).to.be.a('string');
  });
  it('Should return a valid SQL delete statement', function() {
    let sql = `DELETE FROM articles`;
    query.delete().where('id').equals(1);

    let build = query.buildDeleteSQL();
    expect(build.sql == sql).to.equal(true);
  });
});

describe('Query.limit', function() {
  it('Should throw an error if limit is not a number', function() {
    let query = Query.database('test').table('articles').select('id').where('id').equals(1);
    expect(() => query.limit('error')).to.throw(Error);
  });
  it('Should set the limit to the value passed', function() {
    let query = Query.database('test').table('articles').select('id').where('id').equals(1).limit(1);
    expect(query.limitValue).to.equal(1);
  });
  it('Should add a limit clause to the returned SQL', function() {
    let sql = `SELECT articles.'id' FROM articles WHERE articles.'id' = :articles_id LIMIT 1`;
    let build = Query.database('test').table('articles').select('id').where('id').equals(1).limit(1).buildSQL();
    expect(build.sql == sql).to.equal(true);
  });
  it('Should return itself', function() {
    let query = Query.database('test').table('articles').select('id').where('id').equals(1);
    let q = query.limit(1);

    expect(q).to.equal(query);

  });
});

describe('Query.offset', function() {
  it('Should throw an error if offset is not a number', function() {
    let query = Query.database('test').table('articles').select('id').where('id').equals(1);
    expect(() => query.offset('error')).to.throw(Error);
  });
  it('Should set the offset value if passed', function() {
    let query = Query.database('test').table('articles').select('id').where('id').equals(1).offset(1);
    expect(query.offsetValue).to.equal(1);
  });
  it('Should add a offset clause to the returned SQL', function() {
    let sql = `SELECT articles.'id' FROM articles WHERE articles.'id' = :articles_id OFFSET 1`;
    let build = Query.database('test').table('articles').select('id').where('id').equals(1).offset(1).buildSQL();
    expect(build.sql == sql).to.equal(true);
  });
  it('Should return itself', function() {
    let query = Query.database('test').table('articles').select('id').where('id').equals(1);
    let q = query.offset(1);

    expect(q).to.equal(query);

  });
});

describe('Query.get', function() {
  it('Should return a promise', function() {
    let query = Query.database('test').table('articles').select('id').where('id').equals(1);
    expect(query.get() instanceof Promise).to.equal(true);
  });
  it('Should reject the promise if there is no type', function() {
    let query = Query.database('test').table('articles');
    return expect(query.get()).to.eventually.be.rejected;
  });
  it('Should return an object with data and metadata', function() {
    let query = Query.database('test').table('articles').select('id').where('id').greaterThan(0).get();
    return Promise.all([
      expect(query).to.eventually.have.property('data'),
      expect(query).to.eventually.have.property('metadata')
    ])
  });
  it('Should return results if there are any', function() {
    let query = Query.database('test').table('articles').select('id').where('id').greaterThan(0).get();
    return Promise.all([
      expect(query).to.eventually.have.property('data').and.lengthOf(1000)
    ])
  });
  it('Should return an empty results set if there are no results', function() {
    let query = Query.database('test').table('articles').select('id').where('id').greaterThan(1000).get();
    return Promise.all([
      expect(query).to.eventually.have.property('data').and.lengthOf(0)
    ])
  });
  it('Should have a metadata object with properties', function() {
    let query = Query.database('test').table('articles').select('id').where('id').greaterThan(0).get();
    return Promise.all([
      expect(query).to.eventually.have.property('metadata').and.have.property('sql').and.to.equal(`SELECT articles.'id' FROM articles WHERE articles.'id' > :articles_id`),
      expect(query).to.eventually.have.property('metadata').and.have.property('binds').and.to.have.property(':articles_id').and.to.equal(0),
      expect(query).to.eventually.have.property('metadata').and.have.property('rowsModified').and.to.equal(0),
      expect(query).to.eventually.have.property('metadata').and.have.property('executionTime').and.to.be.above(0)
    ])
  });
});
