import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { GenerateTokensDto } from 'src/dto/generate-tokens.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const { refreshToken } = req.cookies;
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const accessToken = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !accessToken || !refreshToken) {
                throw new UnauthorizedException('The user is not authorized(Invalid token or token epsent)');
            }

            const user = this.jwtService.verify(accessToken) as GenerateTokensDto;

            req.user = { id: user.userId, email: user.email };
            return true;
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
