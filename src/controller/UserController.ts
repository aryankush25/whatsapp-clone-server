import { NextFunction, Request, Response } from 'express';
import UserRepository from '../repository/UserRepository';
import jwt from 'jsonwebtoken';
export class UserController {
  private userRepository = new UserRepository();

  async register(request: Request) {
    const user = await this.userRepository.createUser(request.body);

    return {
      ...user,
      token: this.userRepository.generateJWT(user.id, user.email),
    };
  }

  async login(request: Request) {
    const { email, password } = request.body;

    const isValidUser = await this.userRepository.validatePassword(email, password);

    if (isValidUser) {
      const user = await this.userRepository.getUser({ where: { email } });

      return {
        ...user,
        token: this.userRepository.generateJWT(user.id, user.email),
      };
    }
  }

  async me(request: Request) {
    const user = await this.getUserFromRequestObject(request);

    return user;
  }

  async deleteMe(request: Request) {
    const user = await this.getUserFromRequestObject(request);

    return this.userRepository.deleteUser(user.id);
  }

  async getUserFromRequestObject(request: Request) {
    const {
      headers: { authorization },
    } = request;

    const token = authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    const user = await this.userRepository.getUser(decoded['id']);

    return user;
  }
}
