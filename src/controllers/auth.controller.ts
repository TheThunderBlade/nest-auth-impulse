import { Response, Request } from 'express';
import { Controller, Post, Body, Res, Req, Get, UseGuards } from '@nestjs/common';
import { SignInDto } from 'src/dto/sign-in.dto';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { AuthService } from 'src/services/auth.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { IGuardedRequest } from 'src/interfaces/IGuardedRequest';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signUp')
    async signUp(@Body() signUpDto: SignUpDto): Promise<string> {
        await this.authService.signUp(signUpDto);

        return 'User has been successfully created';
    }

    @Post('/signIn')
    async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto): Promise<string> {
        const token = await this.authService.signIn(signInDto);
        res.cookie('refreshToken', token.refreshToken);

        return token.accessToken;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/refresh')
    async refresh(@Req() req: IGuardedRequest, @Res({ passthrough: true }) res: Response): Promise<string> {
        const { user } = req;

        const { refreshToken } = req.cookies;

        const token = await this.authService.refresh({ userId: user.id, refreshToken });
        res.cookie('refreshToken', token.refreshToken);

        return token.accessToken;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/signOut')
    async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
        const { refreshToken } = req.cookies;

        await this.authService.signOut(refreshToken);
        res.clearCookie('refreshToken');

        return 'User has been successfully signed out';
    }
}
