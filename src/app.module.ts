import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import configImports from './imports/config.imports';
import { User } from './models/users.model';
import { Token } from './models/tokens.model';
import { UserModule } from './modules/user.module';

@Module({
    imports: [
        configImports,
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRESS_PORT),
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRESS_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [User, Token],
            autoLoadModels: false,
        }),
        AuthModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
