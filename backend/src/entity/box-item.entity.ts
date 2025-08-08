// src/entity/box-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Box } from './box.entity';

@Entity()
export class BoxItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('varchar')
  rarity: string;

  @Column()
  image: string;

  @Column('int')
  probability: number; // 1-100

  @ManyToOne(() => Box, box => box.items)
  box: Box;
}