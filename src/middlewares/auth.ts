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

      throw new Error('Invalid token!');
    }

    throw new Error('No authorization present!');
  } catch (error) {
    console.error('error', error);

    return response.status(401).json(error);
  }
};

export default authMiddleware;
