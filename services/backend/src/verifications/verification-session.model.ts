import { Column, Model, Table, DataType, CreatedAt, ForeignKey } from 'sequelize-typescript';
import { SessionType } from './constants';
import { User } from 'src/users/user.model';


@Table({ tableName: 'verification_sessions', timestamps: false })
export class VerificationSession extends Model {
    @Column({ allowNull: false })
    declare token: string;

    @Column({ allowNull: false, field: 'user_id' })
    @ForeignKey(() => User)
    declare userId: string;

    @Column({ allowNull: false, type: DataType.JSON })
    declare data: string;

    @Column({ allowNull: false, type: DataType.ENUM(...Object.values(SessionType)) })
    declare type: SessionType;

    @Column({ allowNull: false, field: 'created_at' })
    @CreatedAt
    declare createdAt: Date;


    isExpired(duration: number): boolean {
        return new Date().getTime() > this.createdAt.getTime() + duration;
    }
}