import { IsNumber, IsOptional } from 'class-validator';


export class ChangePfpDto {
    @IsNumber()
    @IsOptional()
    userId?: number;
}