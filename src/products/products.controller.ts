import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  NotFoundException,
  Query,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/products.entity';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs-extra';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const { categoriesIds } = createProductDto;

    if (!Array.isArray(categoriesIds) || categoriesIds.length === 0) {
      throw new BadRequestException('categoryIds must contain at least 1 element');
    }
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (file.originalname.toLowerCase().endsWith('.gif')) {
      throw new BadRequestException('Arquivos .gif não são permitidos');
    }

    const fileName = `${uuidv4()}-${file.originalname}`;
    const uploadPath = './uploads/' + fileName;

    await fs.move(file.path, uploadPath);

    const product = await this.productsService.create(createProductDto);

    const image = await this.productsService.createImage(fileName, product.id);

    return { product, image};
  }
  @Get('/similar/:id')
  async findSimilar(@Param('id') productId: number){
    return await this.productsService.findSimilar(productId);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':minPrice/:maxPrice')
  priceAll(
    @Param('minPrice') minPrice: number,
    @Param('maxPrice') maxPrice: number,
  ): Promise<Products[]> {
    return this.productsService.priceAll(minPrice, maxPrice);
  }

  @Get('/filter/:filterType/:filterValue')
  filterAll(
    @Param('filterType') filterType: string,
    @Param('filterValue') filterValue: string,
  ): Promise<Products[]> {
    if (
      filterType === 'name' ||
      filterType === 'brand' ||
      filterType === 'categories' ||
      filterType === 'description'
    ) {
      return this.productsService.filterAll(filterType, filterValue);
    } else {
      throw new NotFoundException('Tipo de filtro inválido');
    }
  }
  @Get('search')
  async searchProducts(
    @Query('filterValue') filterValue: string,
  ): Promise<Products[]> {
    return this.productsService.search(filterValue);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto
  ) {
    if (file){
      const fileName = `${uuidv4()}-${file.originalname}`;
      const uploadPath = './uploads/' + fileName;
  
      await fs.move(file.path, uploadPath);

      const currentImage = await this.productsService.findImage(id);
      fs.unlink("./uploads/"+currentImage.path);
      this.productsService.removeImage(currentImage.id)

      const newImage = await this.productsService.createImage(fileName, id);
    }

    return this.productsService.update(+id, updateProductDto, file);
  }
  //uploads/0fab28852c2c52f993c2ec03d4855386
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
