const http = require('http');
const fs = require('fs');
const ModelManager = require('./model.manager');
const DatabaseManager = require('./database.manager');

class Server {

  constructor(options = {
    ip: '0.0.0.0',
    port: '8080'
  }) {

    let _ip = null;
    let _port = null;

    Object.defineProperty(this, 'ip', {
      enumerable: true,
      get() {
        return _ip;
      }
    });

    Object.defineProperty(this, 'port', {
      enumerable: true,
      get() {
        return _port;
      }
    });

    _ip = options.ip;
    _port = options.port;

  }

  initialise() {
    //load the models
    this.loadRoutes();
    this.loadDatabases();
    this.loadModels();

    return this;
  }

  loadModels() {
    console.log('Sneaker: Loading Models');

    let files = fs.readdirSync('./models/');
    files.forEach((file) => {
      if(file.includes('.model.json')) {
        let json = fs.readFileSync('./models/' + file);
        let model = JSON.parse(json);
        console.log('Sneaker: ' + model.name + ' model loaded');
        ModelManager.loadModel(model);
      }
    });

    console.log('Sneaker: Models Loaded');
  }

  loadDatabases() {
    console.log('Sneaker: Loading Databases');
    let files = fs.readdirSync('./databases/');
    files.forEach((file) => {
      if(file.includes('.database.json')) {
        let json = fs.readFileSync('./databases/' + file);
        let database = JSON.parse(json);
        console.log('Sneaker: ' + database.name + ' database loaded');
        DatabaseManager.loadDatabase({
          name: database.name
        });
      }
    });
    console.log('Sneaker: Routes Databases');
  }

  loadRoutes() {
    console.log('Sneaker: Loading Routes');
    console.log('Sneaker: Routes Loaded');
  }

  listen() {
    http.createServer((request, response) => {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({"hello": "world"}));
    }).listen(this.port, this.ip);

    console.log('Sneaker: Listening on ' + this.ip + ':' + this.port);
  }
}

let server = new Server().initialise();

module.exports = server;
