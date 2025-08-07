// src/entity/user-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BoxItem } from './box-item.entity';

@Entity()
export class UserItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => BoxItem)
  item: BoxItem;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  obtainedAt: Date;
}