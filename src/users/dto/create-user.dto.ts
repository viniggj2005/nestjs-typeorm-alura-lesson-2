import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsBoolean()
    admin: boolean = false;

    @IsNotEmpty()
    name: string;

    @IsString()
    date_of_birth: string;
    
    @IsString()
    gender: string;

    @IsString()
    cpf: string;
    @IsString()
    complement: string;
    @IsString()
    neighborhood:string;
    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsString()
    city: string;

    @IsString()
    street: string;

    @IsString()
    state: string;

    @IsString()
    cep: string;

    @IsString()
    numberhouse: string;

   
    image: string;
}