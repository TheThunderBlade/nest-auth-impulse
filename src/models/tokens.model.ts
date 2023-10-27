import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { ITokens } from 'src/interfaces/ITokens';
import { User } from './users.model';

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, ITokens> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true, unique: true, allowNull: false })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    refreshToken: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
