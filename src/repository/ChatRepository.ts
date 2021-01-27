import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import { Chat } from '../database/entity/Chat';
import { User } from '../database/entity/User';

interface CreateChatPayload {
  content: string;
  sender: User;
  receiver: User;
}

class ChatRepository {
  private chatRepository = getRepository(Chat);

  async createChat(props: CreateChatPayload) {
    const { content, sender, receiver } = props;

    const chat = await this.chatRepository.save({
      content,
      sender,
      receiver,
      createdAt: new Date().toISOString(),
      id: v4(),
    });

    return chat;
  }

  async getChats(props: Object) {
    const chats = await this.chatRepository.find(props);

    return chats;
  }
}

export default ChatRepository;
