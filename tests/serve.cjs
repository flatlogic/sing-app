const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.gif':'image/gif','.jpg':'image/jpeg','.json':'application/json','.map':'application/json','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
http.createServer((request, response) => {
  const filename = path.join(process.cwd(), decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  if (!["dist", "node_modules"].some(directory => filename.startsWith(path.join(process.cwd(), directory) + path.sep))) {
    response.writeHead(404); response.end('Not found'); return;
  }
  fs.readFile(filename, (error, contents) => {
    if (error) { response.writeHead(404); response.end('Not found'); return; }
    response.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream');
    response.end(contents);
  });
}).listen(4325, '127.0.0.1');
