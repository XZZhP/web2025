// src/entity/box.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BoxItem } from './box-item.entity';

@Entity()
export class Box {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column()
  coverImage: string; // OSS URL或本地路径

  @OneToMany(() => BoxItem, item => item.box, { cascade: true })
  items: BoxItem[];

  @Column({ default: true })
  isActive: boolean; // 是否上架
}