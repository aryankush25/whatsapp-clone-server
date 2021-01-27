import { Entity, PrimaryColumn, Column, BeforeUpdate, ManyToOne, JoinTable } from 'typeorm';
import { User } from './User';

@Entity()
export class Chat {
  @PrimaryColumn()
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user: User) => user.sentChats, {
    cascade: true,
  })
  @JoinTable()
  sender: User;

  @Column({ nullable: true })
  senderId: string;

  @ManyToOne(() => User, (user: User) => user.receivedChats, {
    cascade: true,
  })
  @JoinTable()
  receiver: User;

  @Column({ nullable: true })
  receiverId: string;

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
