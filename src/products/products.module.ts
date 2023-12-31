import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Products } from './entities/products.entity';
import { Images } from 'src/images/entities/images.entity';
import { UnitsOfMeasurement } from 'src/units_of_measurement/entities/units_of_measurement.entity';
import { Categories } from 'src/categories/entities/categories.entity';
import { ImagesService } from 'src/images/images.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Images,UnitsOfMeasurement,Categories])],
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService],
  exports: [ProductsService],
})
export class ProductsModule {}
