import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  url: string;
}
