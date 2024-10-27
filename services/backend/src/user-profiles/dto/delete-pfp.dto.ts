import { IsNumber } from 'class-validator';


export class DeletePfpDto {
    @IsNumber()
    userId?: number;
}