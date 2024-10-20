import { Model, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from 'src/roles/role.model';


@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
    @Column({ allowNull: false })
    declare login: string;

    @Column({ allowNull: false })
    declare nickname: string;

    @Column({ allowNull: false })
    declare password: string;

    @Column({ allowNull: false })
    declare verified: boolean

    @Column({ allowNull: false, field: 'role_id' })
    @ForeignKey(() => Role)
    declare roleId: number;

    @BelongsTo(() => Role)
    declare role: Role;
}