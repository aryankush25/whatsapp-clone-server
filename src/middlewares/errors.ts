import { Request, Response, NextFunction } from 'express';
import ResponseError from '../errors/interface';
import { RouteNotFoundError, InternalServerError } from '../errors';

export const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = RouteNotFoundError();

  next(error);
};

export const handleErrors = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
  if (err.status || err.statusCode) {
    res.status(err.statusCode).json({
      error: err,
    });
  } else {
    res.status(500).json({
      error: err || InternalServerError(),
    });
  }
};
