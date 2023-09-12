import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  unit_of_measurement: import('../../units_of_meansurement/entities/units_of_meansurement.entity').UnitsOfMeansurement[];
}