import ResponseError from './interface';

const error: ResponseError = new Error();

// use https://httpstatuses.com/ to create new errors

export const RouteNotFoundError = () => {
  error.statusCode = 404;
  error.message =
    'The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.';
  error.name = 'ROUTE_NOT_FOUND';

  return error;
};

export const InternalServerError = () => {
  error.statusCode = 500;
  error.message = 'The server encountered an unexpected condition that prevented it from fulfilling the request.';
  error.name = 'INTERNAL_SERVER_ERROR';

  return error;
};

export const UnauthorizedError = () => {
  error.statusCode = 401;
  error.message =
    'The request has not been applied because it lacks valid authentication credentials for the target resource.';
  error.name = 'UNAUTHORIZED';

  return error;
};

export const UserDoesNotExistError = () => {
  error.statusCode = 404;
  error.message = 'The user does not exist or has been deleted.';
  error.name = 'USER_DOES_NOT_EXIST';

  return error;
};

export const UserAlreadyOnlineError = () => {
  error.statusCode = 403;
  error.message = 'The user is already connected from another socket.';
  error.name = 'USER_ALREADY_ONLINE';

  return error;
};

export const ArgumentsDoesNotExistError = () => {
  error.statusCode = 406;
  error.message = 'Invalid Arguments';
  error.name = 'INVALID_ARGUMENTS';

  return error;
};
