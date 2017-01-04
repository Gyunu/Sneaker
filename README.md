#Sneaker
Sneaker is a RESTful SQLite3 backed API and ORM for small websites that need flexibility in the data it manages. It's agnostic to templating systems and just manages data, returning JSON and having a minimal API to fetch, create, update and destroy.

It's for smaller projects that would like to keep relational data, doesn't need the overhead of a flat file system and its drawbacks and issues (mostly bound tightly to the view system).

I've found use in Electron apps - allowing easy access to data that doesn't require a lot of custom code and packages that don't work on the platform.

The electron version will be a different branch, once the web version is finished as the current version I'm using in electron is quite tightly bound to my logic at the moment.


##Database
A database file controls all operations with an SQLite3 database, including opening, closing and saving (writing to disk).

The Databases within the `databases` folder are opened automatically when the server starts, and are shared between requests.

###To make a new database
run `npm run make:database [name]`.  
The name argument is required, and the corresponding database file is created.   

On application launch, the SQLlite file is created in memory, and written to disk.

You can have multiple databases open, and models and such take a database option to select data from specific databases. You can cross reference models on different databases, as each model specifies it's own database.

After making your database, `require` the database in the `index` file, and add it to the array of databases. This will make the database available.
 To get the current databases, just `require` the database folder and access it via `Databases[name]`.
 
###Methods
####`Database.save()`:
Saves the database to disk.

<br>
<hr>
<br>

##Migrations

Migrations allow you to add new tables and alter current tables by running the command `migrate`.   

This will run all migration files within the `migrations` folder that have not yet been run, altering the SQLite database and saving it to disk.

###To create a new migration

Run `npm run make:migration [migration name] [database name]` both the migration name and database name arguments are required. In the new file generated, write all your migration operations within the `up` function, using the schema with `this.schema`.  

In the `down` function you can call operations that should be run when `migrate:rollback` is called.

After making your migration, `require` the migration in the `index` file, and add it to the array of migrations. This will make it run when you run the command.

###Rollback migrations

Running `npm run migrate:rollback` will undo all migrations that have a `down` function - usually dropping tables and columns.


<br>
<hr>
<br>

##Models

Models live in the `models` folder and handle all model interactions. 

The constructor takes three options:  

`fillable`: currently not used, but will allow quick setting of attributes, and lock off the rest of them to changes. Takes an array of column names.  
`hidden`: removes certain column names from the results. Takes an array of column names.  
`database`: Required. The database that corresponds to where the data lives.

To find a model, use the static methods `find`, `where` or `whereBetween`. These return a model instance, so you can chain methods.


###Creating a new model

Run `npm make:model [name] [database]`  

Both arguments are required, and the file is created in the `models` folder. Add any relationships and options into the file as needed.

###Static Methods

These static methods are provided to make querying a model much more simple syntax wise and takes care of instantiating a valid new model instance.

`Model.find(id, ?database)`:    
Model.find returns a new model instance and is short hand for `Model.where('id', '=', [id])`. The database argument is optional, as the database is defined as a default option in the constructor of the model.

`Model.where(column, predicate, value, ?database)`:  
Mode.where returns a new model instance and will return results where the statement matches. Valid predicates are: `=`, `!=`, `>`, `<`, `like`. Database is optional.

`Model.whereBetween(column, start, end, ?database)`:  
Model.whereBetween returns a new model instance and will return results where the value falls between the two values. Database is optional.

`Model.getColumns()`:  
Returns all the columns for the model.

###Chainable Methods

####`Model.andWhere(column, predicate, value)`:   

`Model.andWhere` is a chainable method that adds another where clause which must match data to return results.  

####`Model.orWhere(column, predicate, value)`:

`Model.orWhere` is much like `Model.andWhere` but returns results where either the initial where clause or the one set by this method matches.


####`Model.andWhereBetween(column, start, end)`:  

`Model.andWhereBetween` is a chainable method which limits results between two bounds, the start and end values and returns results which match.  

####`Model.orWhereBetween(column, start, end)`:

`Model.orWhereBetween` is like `Model.andWhereBetween` but returns results where either where clause matches.


####`Model.with(relationshipName, ?callback)`:  

`Model.with` is a chainable method which defines relationships to resolve when the model query is run.  
The relationship name argument must correspond to a function on the class defined with `Model.has`;

and example would be (on the model class definition):
`articles() {
	return this.has(Article, 'id', 'article_id');
}`

where `articles` would be the relationship name, and would return all articles which have an id which matches the models `article_id` column. The relationship name can be anything, as long as it returns `this.has(...)`. 

####`Model.limit(number)`:  

`Model.limit` limits the number of results returned in the query and is chainable.

####`Model.offset(number)`:  

`Model.offset` offsets the query results and is chainable.

####`Model.asJson()`:  

`Model.asJson` returns the models attributes, flattened (along with it's relationships) and a JSON object. Useful if you're just returning the data to a client.

####`Model.asAttributes()`:  

`Model.asAttributes` returns just the models attributes as an object and not a fully instantiated object. Useful if you want to manipulate the data before returning it as a response or passing it to templates.

####`Model.save()`:  

`Model.save` saves a model to the database where the ID matches, should you have changed any data on it. It saves a new row in the database if there is no ID defined on the attributes.

###Instance Methods

####`Model.updateAttribute(name, value)`:
This updates a models attribute where the name matches, useful if you need to change a value and then save the model.

####`Model.hydrate({...attribute: value})`:
This is mostly an internal/private method, but can be used to quickly update a models attributes from a datasource for saving.

####`Model.hydrateNewInstance({...attribute: value})`:
This is basically hydrate, but returns a new model instance rather than affecting the current. Useful for cloning results.

####`Model.getAttributes()`:  
Returns the models data as an object.

####`Model.getAttributesAsJson()`:
Returns the models data as json.

####`Model.flatten()`:
Flattens the models attributes so the relationships are no longer full model instances, but are just plain objects. Useful for templates where you need to keep the base model but the relationships are just for data purposes.

Saves having to write `articles.attributes.image.attributes.url` and can be instead: `articles.image.url`.

####`Model.addRelationshipQuery()`:
This is a private method, don't use unless you know what you're doing. Use `with` and `has` instead - they call this method.

####`Model.get()`:
This runs the model with the specified parameters set out by `where` and the like and returns a promise where the only argument is the results - either an array of models or attributes or a JSON object. If there are no results it will be an empty array.

This method is required to execute and query and should be the final call on the model, then followed by a `.then((results) => {})` call.

###Examples:

To find an article, which has authors and images where the date is between 01/01/2016 and 01/01/2017

`Article.whereBetween('published_date', '01/01/2016', '01/01/2017').with('images').with('authors').get().then((results) => {});`

To find an article where the author is Dave. This shows using the callback in the with function - it passes the relationship model as an argument which you can then query like the parent:

`//TODO need to make a select all query type - .all()`

`Articles.where('id', '>', '0').with('authors', (author) => {`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` author.where('name', '=', 'Dave')`  
`}.get().then((results) => {});`


###Custom Class Methods
`Model.has(RelatedModelConstructor, RelatedColumnName, ThisColumnName)`:  

`Model.has` is defined in the class definition as a function, named how ever you feel, but takes the related model constructor (not instantiated), the related column name and the column that corresponds on the current model. It defines relationships between models that are built up when `Model.with` is called.

<br>
<hr>
<br>

##Seeder

The seeder populated a database with data defined in it.

The `seed` function is where you put your data.

example:

`seed() {`  
&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`this.schema.insert('articles', `  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`[ `  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`{'title': 'Test', 'author': 'Dave, 'image_id': 1}`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`]) `  
`}`

It takes an array of objects which correspond to rows in the database, and populates the values to the column names.

To run the seeders, run `npm run seed`.

To make a new seeder, run `npm make:seeder [name] [database]`  
The arguments are required, and the file is created within the `seeders` folder.

After making your seeder, `require` the seeder in the `index` file, and add it to the array of seeders. This will make it run when you run the command.
