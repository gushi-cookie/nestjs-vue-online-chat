import { Model, Table, Column, DataType } from 'sequelize-typescript';


@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
    @Column({ allowNull: false })
    declare login: string;

    @Column({ allowNull: false })
    declare nickname: string;

    @Column({ allowNull: false })
    declare password: string;

    @Column({ allowNull: false })
    declare email: string;

    @Column({ allowNull: false })
    declare verified: boolean;

    @Column({ allowNull: false, type: DataType.JSON })
    declare abilities: string;
}