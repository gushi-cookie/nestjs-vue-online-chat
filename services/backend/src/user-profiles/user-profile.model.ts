import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/user.model';


@Table({ tableName: 'user_profiles', timestamps: false })
export class UserProfile extends Model {
    @Column({ allowNull: true, field: 'profile_picture_id' })
    declare profilePictureId: string;

    @Column({ allowNull: false, field: 'user_id' })
    @ForeignKey(() => User)
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}