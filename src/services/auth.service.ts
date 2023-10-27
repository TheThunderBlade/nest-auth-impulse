import * as bcrypt from 'bcrypt';
import {
    Injectable,
    HttpException,
    HttpStatus,
    ConflictException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { User } from 'src/models/users.model';
import { TokenService } from './tokens.service';
import { SignInDto } from 'src/dto/sign-in.dto';
import { UserTokenDto } from 'src/dto/user-token.dto';
import { IGenerateTokens } from 'src/interfaces/IGeneratedTokens';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private tokenService: TokenService,
    ) {}

    async signUp(dto: SignUpDto): Promise<void> {
        try {
            const existedUser = await this.userRepository.findOne({ where: { email: dto.email } });
            if (existedUser) {
                throw new ConflictException('User with this email already exists');
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);
            await this.userRepository.create({ ...dto, password: hashedPassword });
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async signIn(dto: SignInDto): Promise<IGenerateTokens> {
        try {
            const user = await this.userRepository.findOne({ where: { email: dto.email } });
            if (!user) {
                throw new NotFoundException('User with this email not found');
            }
            const password = await bcrypt.compare(dto.password, user.password);
            if (!password) {
                throw new BadRequestException('Invalid password');
            }
            const dbToken = await this.tokenService.getTokenByUserId(user.id);
            if (dbToken) {
                await this.tokenService.removeToken(dbToken);
            }

            const tokens = this.tokenService.generateTokens({ userId: user.id, email: user.email });
            await this.tokenService.saveToken({
                userId: user.id,
                refreshToken: tokens.refreshToken,
            });

            return tokens;
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async refresh(dto: UserTokenDto): Promise<IGenerateTokens> {
        try {
            const userData = await this.tokenService.validateRefreshToken(dto.refreshToken);
            const tokenFromDb = await this.tokenService.getTokenByUserId(dto.userId);

            if (!userData || !tokenFromDb) {
                throw new UnauthorizedException('Token validation failed');
            }

            const user = await this.userRepository.findOne({ where: { id: userData.userId } });
            const tokens = this.tokenService.generateTokens({ userId: user.id, email: user.email });
            await this.tokenService.saveToken(
                {
                    userId: user.id,
                    refreshToken: tokens.refreshToken,
                },
                true,
            );
            return tokens;
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async signOut(refreshToken: string): Promise<void> {
        try {
            await this.tokenService.removeToken(refreshToken);
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
