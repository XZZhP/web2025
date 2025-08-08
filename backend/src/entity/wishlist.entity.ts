// src/entity/wishlist.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Box } from './box.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Box)
  box: Box;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;
}