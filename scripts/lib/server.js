'use strict';

const connect = require('connect');
const http = require('http');
const { underline } = require('picocolors');
const Promise = require('bluebird');
const open = require('open');
const net = require('net');

module.exports = function(hexo, args) {
  const app = connect();
  const { config } = hexo;
  const ip = args.i || args.ip || config.server.ip || undefined;
  const port = parseInt(args.p || args.port || config.server.port || process.env.port, 10) || 4000;
  const { root } = config;

  return checkPort(ip, port).then(() => hexo.extend.filter.exec('server_middleware', app, {context: hexo})).then(() => {
    if (args.s || args.static) {
      return hexo.load();
    }

    return hexo.watch();
  }).then(() => startServer(http.createServer(app), port, ip)).then(server => {
    const addr = server.address();
    const addrString = formatAddress(ip || addr.address, addr.port, root);

    hexo.log.info('Hexo[%s] is running at %s . Press Ctrl+C to stop.', args.theme, underline(addrString));
    hexo.emit('server');
    return server;
  }).catch(err => {
    switch (err.code) {
      case 'EADDRINUSE':
        hexo.log.fatal(`Port ${port} has been used. Try other port instead.`);
        break;

      case 'EACCES':
        hexo.log.fatal(`Permission denied. You can't use port ${port}.`);
        break;
    }

    hexo.unwatch();
    throw err;
  });
};

function startServer(server, port, ip) {
  return new Promise((resolve, reject) => {
    server.listen(port, ip, resolve);
    server.on('error', reject);
  }).then(() => server);
}

function checkPort(ip, port) {
  if (port > 65535 || port < 1) {
    return Promise.reject(new RangeError(`Port number ${port} is invalid. Try a number between 1 and 65535.`));
  }

  const server = net.createServer();

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.once('listening', resolve);
    server.listen(port, ip);
  }).then(() => { server.close(); });
}

function formatAddress(ip, port, root) {
  let hostname = ip;
  if (ip === '0.0.0.0' || ip === '::') {
    hostname = 'localhost';
  }

  let path = root.startsWith("/") ? root : `/${root}`;
  return new URL(`http://${hostname}:${port}${path}`).toString();
}