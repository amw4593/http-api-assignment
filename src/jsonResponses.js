const respondJSON = (request, response, status, object, contentType = 'application/json') => {
  response.writeHead(status, { 'Content-Type': contentType });

  if (contentType === 'application/json') {
    response.write(JSON.stringify(object));
  } else if (contentType === 'text/xml') {
    response.write(`<response><message>${object.message}</message></response>`);
  }

  response.end();
};
const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  respondJSON(request, response, 200, responseJSON);
};

const badRequest = (request, response, params) => {
  const responseJSON = {
    message: '',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const unauthorized = (request, response, params) => {
  const responseJSON = {
    message: 'Missing loggedIn query parameter set to yes',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.id = 'unauthorized';
    return respondJSON(request, response, 401, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const forbidden = (request, response) => {
  const responseJSON = {
    message: 'Forbidden: You do not have access to this content',
    id: 'forbidden',
  };

  respondJSON(request, response, 403, responseJSON);
};

const internal = (request, response) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  respondJSON(request, response, 500, responseJSON);
};

const notImplemented = (request, response) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for uplaoded content.',
    id: 'notImplemented',
  };

  respondJSON(request, response, 501, responseJSON);
};

module.exports = {
  success,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
};
