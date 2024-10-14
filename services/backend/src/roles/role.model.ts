import { Column, Model, Table } from 'sequelize-typescript';


@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model {
    @Column({ allowNull: false })
    declare name: string;
}