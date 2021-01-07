import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
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

  @Column({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'timestamp' })
  updatedAt: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: string;

  @BeforeInsert()
  addInitialFields() {
    this.id = v4();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date().toISOString();
  }
}
