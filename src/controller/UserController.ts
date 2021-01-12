import { NextFunction, Request, Response } from 'express';
import { UserDoesNotExistError } from '../errors';
import UserRepository from '../repository/UserRepository';
export class UserController {
  private userRepository = new UserRepository();

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await this.userRepository.createUser(request.body);

      return {
        ...user,
        token: this.userRepository.generateJWT(user.id, user.email),
      };
    } catch (error) {
      return next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      console.log('#### email', email);
      console.log('#### password', password);

      const isValidUser = await this.userRepository.validatePassword(email, password);

      console.log('#### isValidUser', isValidUser);

      if (!isValidUser) {
        throw UserDoesNotExistError();
      }

      const user = await this.userRepository.getUser({ where: { email } });

      return {
        ...user,
        token: this.userRepository.generateJWT(user.id, user.email),
      };
    } catch (error) {
      return next(error);
    }
  }

  async me(request: Request, response: Response, next: NextFunction) {
    try {
      return response.locals.user;
    } catch (error) {
      return next(error);
    }
  }

  async deleteMe(request: Request, response: Response, next: NextFunction) {
    try {
      return this.userRepository.deleteUser(response.locals.user.id);
    } catch (error) {
      return next(error);
    }
  }
}
