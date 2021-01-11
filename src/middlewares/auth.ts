import { NextFunction, Request, Response } from 'express';
import UserRepository from '../repository/UserRepository';

const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {
      headers: { authorization },
    } = request;

    if (authorization && authorization.split(' ')[0] === 'Bearer' && authorization.split(' ')[1]) {
      const token = authorization.split(' ')[1];

      const userRepository = new UserRepository();

      const dataFromToken = userRepository.verifyToken(token);

      if (dataFromToken['id']) {
        next();
      }

      return null;
    }

    throw new Error('No authorization present!');
  } catch (error) {
    console.log('error', error);

    return response.status(404).json();
  }
};

export default authMiddleware;
