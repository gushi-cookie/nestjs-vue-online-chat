import { IsString } from "class-validator";

export default class SignInDto {
    @IsString()
    login: string;

    @IsString()
    password: string;

    
    constructor(login: string, password: string) {
        this.login = login;
        this.password = password;
    }
}