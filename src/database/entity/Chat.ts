import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import { v4 } from 'uuid';
import { User } from './User';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  content: string;

  @ManyToMany(() => User, (user: User) => user.chats, {
    cascade: true,
  })
  createdBy: User;

  @ManyToMany(() => User, (user: User) => user.chats, {
    cascade: true,
  })
  sentTo: User;

  @Column({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'timestamp', nullable: true })
  @JoinTable()
  updatedAt: string;

  @Column({ type: 'timestamp', nullable: true })
  @JoinTable()
  deletedAt: string;

  @BeforeInsert()
  addInitialFields() {
    this.id = v4();
    this.createdAt = new Date().toISOString();
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date().toISOString();
  }
}
