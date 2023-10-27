import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { User } from 'src/models/users.model';
import { Token } from 'src/models/tokens.model';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from 'src/services/tokens.service';
import configImports from 'src/imports/config.imports';

@Module({
    controllers: [AuthController],
    providers: [AuthService, TokenService],
    imports: [
        configImports,
        SequelizeModule.forFeature([User, Token]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: '30d',
            },
        }),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
