import { ApiBodyOptions, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { DtoDescription } from 'src/common/pipes/multi-dto-validation.pipe';


export class SignInBaseDto {
    @IsString()
    @ApiProperty()
    readonly password: string;
}

export class SignInByLoginDto extends SignInBaseDto {
    @IsString()
    @ApiProperty()
    readonly login: string;
}

export class SignInByEmailDto extends SignInBaseDto {
    @IsEmail()
    @ApiProperty()
    readonly email: string;
}


export const signInDtos: DtoDescription[] = [
    {
        dtoClass: SignInByLoginDto,
        uniqueFields: ['login'],
    },
    {
        dtoClass: SignInByEmailDto,
        uniqueFields: ['email'],
    },
];

export const signInApiBodyOptions: ApiBodyOptions = {
    schema: {
        oneOf: [
            { $ref: getSchemaPath(SignInByLoginDto) },
            { $ref: getSchemaPath(SignInByEmailDto) },
        ]
    }
};

export const signInApiExtraModels: Function[] = [SignInByLoginDto, SignInByEmailDto];