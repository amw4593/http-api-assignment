const http = require('http');
const url = require('url');
const query = require('querystring');
const path = require('path');
const fs = require('fs');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/unauthorized': jsonHandler.unauthorized,
  '/forbidden': jsonHandler.forbidden,
  '/internal': jsonHandler.internal,
  '/notImplemented': jsonHandler.notImplemented,
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  if (parsedUrl.pathname.includes('.css')) {
    const filePath = path.join(__dirname, '..', 'client', parsedUrl.pathname);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write('Internal Server Error');
        response.end();
      } else {
        response.writeHead(200, { 'Content-Type': 'text/css' });
        response.write(data);
        response.end();
      }
    });
  } else if (urlStruct[parsedUrl.pathname]) {
    const acceptHeader = request.headers.accept || 'application/json';
    console.log(`Accept Header: ${acceptHeader}`);
    const type = acceptHeader.includes('xml') ? 'text/xml' : 'application/json';

    urlStruct[parsedUrl.pathname](request, response, params, type);
  } else {
    urlStruct.notFound(request, response, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
