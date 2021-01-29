import { Entity, PrimaryColumn, Column, BeforeUpdate, OneToMany, JoinTable } from 'typeorm';
import { Chat } from './Chat';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column('text')
  name: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column()
  hashedPassword: string;

  @Column({ default: false })
  isOnline: boolean;

  @OneToMany(() => Chat, (chat: Chat) => chat.sender)
  @JoinTable()
  sentChats: Chat[];

  @OneToMany(() => Chat, (chat: Chat) => chat.receiver)
  @JoinTable()
  receivedChats: Chat[];

  @Column({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: string;

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date().toISOString();
  }
}
