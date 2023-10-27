import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import configImports from 'src/imports/config.imports';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/users.model';
import { Token } from 'src/models/tokens.model';
import { AuthModule } from './auth.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [configImports, SequelizeModule.forFeature([User, Token]), AuthModule],
    exports: [UserService],
})
export class UserModule {}
