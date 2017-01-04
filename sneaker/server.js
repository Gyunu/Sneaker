//config todo in ENV
let http = require("http");
let Databases = require('../databases');

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

  }

  listen() {
    console.log(Databases);
    http.createServer((request, response) => {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(res));
    }).listen(this.port, this.ip);
  }
}

let server = new Server();

module.exports = server;
