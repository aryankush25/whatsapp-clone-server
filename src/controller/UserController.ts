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

      const isValidUser = await this.userRepository.validatePassword(email, password);

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

  async setUserOnline(userId: number, socketId: string) {
    try {
      return this.userRepository.updateUser({
        searchProps: userId,
        updatedValues: {
          isOnline: true,
          socketId,
        },
      });
    } catch (error) {
      console.error('setUserOnline error', error);
    }
  }

  async setUserOffline(socketId: string) {
    try {
      return this.userRepository.updateUser({
        searchProps: {
          where: {
            socketId,
          },
        },
        updatedValues: {
          isOnline: false,
          socketId: null,
        },
      });
    } catch (error) {
      console.error('setUserOffline error', error);
    }
  }

  async meSocketId(socketId: string) {
    try {
      return this.userRepository.getUser({
        where: {
          socketId,
        },
      });
    } catch (error) {
      console.error('setUserOffline error', error);
    }
  }
}
