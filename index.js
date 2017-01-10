let Article = require('./models/article.model');
let Databases = require('./databases');

Article.find(1).with('author').get().then((results) => {
  console.dir(results[0].attributes);
});
//
// var Server = require('./sneaker/server');
//
// Server.listen();
