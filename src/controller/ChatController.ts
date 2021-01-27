import { NextFunction, Request, Response } from 'express';
import ChatRepository from '../repository/ChatRepository';
import UserRepository from '../repository/UserRepository';

export class ChatController {
  private chatRepository = new ChatRepository();
  private userRepository = new UserRepository();

  async createMessage(message: string, socketId: string, receiverId: string) {
    const sender = await this.userRepository.getUser({ where: { socketId } });
    const receiver = await this.userRepository.getUser(receiverId);

    const chat = await this.chatRepository.createChat({
      content: message,
      sender,
      receiver,
    });

    return chat;
  }

  async getChatsBetween(request: Request, response: Response, next: NextFunction) {
    const { chatWithUserId, take, skip } = request.body;

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
  }
}
