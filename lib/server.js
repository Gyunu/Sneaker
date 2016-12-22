//config todo in ENV
const http = require("http");

const Article = require("../models/article.model");

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

  listen() {
    http.createServer((request, response) => {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(res));
    }).listen(this.port, this.ip);
  }
}

const server = new Server();

module.exports = server;
