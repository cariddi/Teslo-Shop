import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '.';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE', // this will delete images related to a product when deleting such product
  })
  product: Product;
}
