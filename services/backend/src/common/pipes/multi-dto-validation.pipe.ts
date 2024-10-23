import { ArgumentMetadata, BadRequestException, PipeTransform, ValidationPipe } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';


export interface DtoDescription {
    dtoClass: ClassConstructor<any>;
    uniqueFields: string[];
}


export class MultiDtoValidationPipe implements PipeTransform<any> {
    constructor(private readonly dtos: DtoDescription[]) {
        this.checkFieldsUniqueness();
    }


    private checkFieldsUniqueness() {
        for(let dto1 of this.dtos) {
            for(let dto2 of this.dtos) {
                if(dto1.dtoClass === dto2.dtoClass) continue;
                if(dto1.uniqueFields.some(val => dto2.uniqueFields.includes(val))) {
                    throw new Error(`Fields are not unique for '${dto1.dtoClass.name}' and '${dto2.dtoClass.name}' dtos.`);
                }
            }
        }
    }


    async transform(value: any, metadata: ArgumentMetadata) {
        let appropriateDto;
        let valueProps = Object.getOwnPropertyNames(value);
        for(let dto of this.dtos) {
            if(dto.uniqueFields.some(val => valueProps.includes(val))) {
                appropriateDto = dto;
                break;
            }
        }

        if(!appropriateDto) throw new BadRequestException(`Couldn't identify dto type, according to your data.`);


        let transformed = plainToInstance(appropriateDto.dtoClass, value);
        let validation = await validate(transformed);

        if(validation.length > 0) {
            let validationPipe = new ValidationPipe();
            let exceptionFactory = validationPipe.createExceptionFactory();
            throw exceptionFactory(validation);
        } else {
            return transformed;
        }
    }
}