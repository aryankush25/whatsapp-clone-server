import { NextFunction, Request, Response } from 'express';
import { ArgumentsDoesNotExistError } from '../errors';
import ChatRepository from '../repository/ChatRepository';
import UserRepository from '../repository/UserRepository';
import { isNilOrEmpty } from '../utils/helpers';

export class ChatController {
  private chatRepository = new ChatRepository();
  private userRepository = new UserRepository();

  async createMessage(message: string, userId: string, receiverId: string) {
    try {
      const sender = await this.userRepository.getUser(userId);
      const receiver = await this.userRepository.getUser(receiverId);

      const chat = await this.chatRepository.createChat({
        content: message,
        sender,
        receiver,
      });

      return { chat, sender, receiver };
    } catch (error) {
      throw error;
    }
  }

  async getChatsBetween(request: Request, response: Response, next: NextFunction) {
    try {
      const { chatWithUserId, take, skip } = request.query;

      if (isNilOrEmpty(chatWithUserId)) {
        throw ArgumentsDoesNotExistError();
      }

      const sender = response.locals.user;
      const receiver = await this.userRepository.getUser(chatWithUserId);

      const chats = await this.chatRepository.getChats({
        where: [
          {
            sender,
            receiver,
          },
          {
            sender: receiver,
            receiver: sender,
          },
        ],
        order: {
          createdAt: 'DESC',
        },
        cache: true,
        take,
        skip,
      });

      return chats;
    } catch (error) {
      return next(error);
    }
  }
}
