import { Categories } from 'src/categories/entities/categories.entity';
import { Images } from 'src/images/entities/images.entity';
import { Purchases } from 'src/purchases/entities/purchases.entity';
import { UnitsOfMeasurement } from 'src/units_of_measurement/entities/units_of_measurement.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  ManyToOne,
    OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
@Entity()
export class Products {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ default: 'None', nullable: true })
  brand: string;

  @Column({ type: 'numeric' })
  weight: number;

  @Column({nullable: true})
  offer: number;
  

  @ManyToMany(() => Categories, categories => categories.products)
  @JoinTable({ name: 'category_products' }) 
  categories: Categories[];
  

  @Column()
  amount: number;

  @Column()
  description: string;
  
  @ManyToOne(() =>UnitsOfMeasurement, (units_of_measurements) => units_of_measurements.products)
  units_of_measurements: UnitsOfMeasurement;


  @OneToMany(() => Purchases, (purchase) => purchase.product)
  purchases: Purchases[];

  @Column({ type: 'numeric' })  
  price: number;

  @OneToMany(() => Images, (image) => image.product)
  images: Images[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

}
