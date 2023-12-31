import {
  Controller,
  Request,
  Get,  
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs-extra';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  EntityManager: any;
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (file.originalname.toLowerCase().endsWith('.gif')) {
      throw new BadRequestException('Arquivos .gif não são permitidos');
    }
    let fileName;
    if (file) {
      fileName = `${uuidv4()}-${file.originalname}`;
      const uploadPath = './uploads/' + fileName;
      await fs.move(file.path, uploadPath);
      createUserDto.image = fileName;
    } else {
      createUserDto.image = 'imagem-padrao.gif';
    }

    const user = await this.usersService.create(createUserDto);
    return { user, fileName };
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/upload')
  async uploadupdateFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const userIsAdm = async (id: number) => {
      const user = await this.usersService.findOneById(id);

      if(user.admin) return true;
      else return false;
    }

    if (file.originalname.toLowerCase().endsWith('.gif') && await userIsAdm(+id) === false) {
      throw new BadRequestException('Arquivos .gif não são permitidos');
    }
  
    const fileName = `${uuidv4()}-${file.originalname}`;
    const uploadPath = './uploads/' + fileName;
  
    await fs.move(file.path, uploadPath);
    updateUserDto.image = fileName;
    const user = await this.usersService.updateimage(+id, updateUserDto);
  
    return { user, fileName };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
