import { IsEmail, IsString, ValidateIf } from 'class-validator';


export default class SignInDto {
    @IsString()
    @ValidateIf((ob: SignInDto) => !ob.email || !!ob.login)
    login?: string;

    @IsEmail()
    @ValidateIf((ob: SignInDto) => !ob.login || !!ob.email)
    email?: string;

    @IsString()
    password: string;
}