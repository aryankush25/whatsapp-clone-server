import { NextFunction, Request, Response } from 'express';
import { In } from 'typeorm';
import * as R from 'ramda';
import { Chat } from '../database/entity/Chat';
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

  async getInitiatedChatUsers(request: Request, response: Response, next: NextFunction) {
    try {
      const currentUserWithChats = await this.userRepository.getUser(response.locals.user.id, {
        relations: ['sentChats', 'receivedChats'],
      });

      let friends = [];

      currentUserWithChats.sentChats.forEach((chat: Chat) => {
        friends.push({
          chat,
          chatWith: chat.receiverId,
        });
      });

      currentUserWithChats.receivedChats.forEach((chat: Chat) => {
        friends.push({
          chat,
          chatWith: chat.senderId,
        });
      });

      friends.sort((first, second) => {
        return second.chat.createdAt - first.chat.createdAt;
      });

      friends = R.uniqBy(R.prop('chatWith'), friends);

      const friendsData = await this.userRepository.getUsers({
        where: {
          id: In(friends.map((friend) => friend.chatWith)),
        },
      });

      friends = friends.map((friend) => {
        return {
          ...R.find(R.propEq('id', friend.chatWith))(friendsData),
          latestChat: friend.chat,
        };
      });

      return friends;
    } catch (error) {
      return next(error);
    }
  }

  async setUserOnline(userId: string) {
    try {
      return this.userRepository.updateUser({
        searchProps: userId,
        updatedValues: {
          isOnline: true,
        },
      });
    } catch (error) {
      console.error('setUserOnline error', error);
    }
  }

  async setUserOffline(userId: string) {
    try {
      return this.userRepository.updateUser({
        searchProps: userId,
        updatedValues: {
          isOnline: false,
          socketId: null,
        },
      });
    } catch (error) {
      console.error('setUserOffline error', error);
    }
  }
}
