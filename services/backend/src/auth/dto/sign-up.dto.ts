import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLocale, IsString } from 'class-validator';


export default class SignUpDto {
    @IsString()
    @ApiProperty()
    readonly login: string;

    @IsString()
    @ApiProperty()
    readonly nickname: string;

    @IsString()
    @ApiProperty()
    readonly password: string;
    
    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @IsLocale()
    @ApiProperty({ description: 'ISO_639-1 code.' })
    readonly locale: string;
}