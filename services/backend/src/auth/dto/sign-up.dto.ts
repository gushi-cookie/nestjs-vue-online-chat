import { IsEmail, IsLocale, IsString } from 'class-validator';


export default class SignUpDto {
    @IsString()
    login: string;

    @IsString()
    nickname: string;

    @IsString()
    password: string;
    
    @IsEmail()
    email: string;

    @IsLocale()
    locale: string;
}