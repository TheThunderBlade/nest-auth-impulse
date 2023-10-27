import { Column, DataType, Model, Table, HasOne } from 'sequelize-typescript';
import { IUsers } from 'src/interfaces/IUsers';
import { Token } from './tokens.model';

@Table({ tableName: 'users' })
export class User extends Model<User, IUsers> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true, unique: true, allowNull: false })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @HasOne(() => Token)
    token: Token;
}
