// src/entity/showcase.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserItem } from './user-item.entity';

@Entity()
export class Showcase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserItem)
  userItem: UserItem;

  @ManyToOne(() => User)
  user: User;

  @Column('text')
  comment: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 0 })
  likes: number;
}