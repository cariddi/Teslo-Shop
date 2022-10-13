import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //TODO: add pagination
  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    // Option 1

    // try {
    //   const product = await this.productRepository.findOneByOrFail({ id });
    //   return product;
    // } catch (error) {
    //   this.handleDBExceptions(error);
    // }

    // Option 2
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException('Product with ID ' + id + 'not found');

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const productToDelete = await this.findOne(id);
    this.productRepository.delete(id); // could also use the 'remove' method

    return productToDelete;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    // Added by the 'findOne' method - Option 1
    if (error instanceof EntityNotFoundError)
      throw new BadRequestException('Entity not found');

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error');
  }
}
