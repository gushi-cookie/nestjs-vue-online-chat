import { Omit } from 'sequelize-typescript/dist/shared/types';
import { CountOptions } from 'sequelize';


export namespace queryEmptyOptions {
    export function createCountOptions(): Omit<CountOptions, 'group'> {
        return {
            where: undefined,
            col: undefined,
            include: undefined,
            logging: undefined,
            benchmark: undefined,
            transaction: undefined,
            useMaster: undefined,
            attributes: undefined,
            paranoid: undefined,
            distinct: undefined
        };
    }
}