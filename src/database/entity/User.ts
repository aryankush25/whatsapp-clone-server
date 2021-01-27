import { Entity, PrimaryColumn, Column, BeforeUpdate, ManyToMany } from 'typeorm';
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

  @Column('text', {
    unique: true,
    nullable: true,
  })
  socketId: string;

  @ManyToMany(() => Chat)
  chats: Chat[];

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
