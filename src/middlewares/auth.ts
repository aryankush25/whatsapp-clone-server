import { NextFunction, Request, Response } from 'express';
import UserRepository from '../repository/UserRepository';
import { UnauthorizedError, UserDoesNotExistError } from '../errors';

const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {
      headers: { authorization },
    } = request;

    if (authorization && authorization.split(' ')[0] === 'Bearer' && authorization.split(' ')[1]) {
      const userRepository = new UserRepository();

      const token = authorization.split(' ')[1];

      const dataFromToken = userRepository.verifyToken(token);

      if (dataFromToken['id']) {
        const user = await userRepository.getUser(dataFromToken['id']);

        if (!user) {
          throw UserDoesNotExistError();
        }

        response.locals.user = user;

        return next();
      }
    }

    throw UnauthorizedError();
  } catch (error) {
    return next(error);
  }
};

export default authMiddleware;
