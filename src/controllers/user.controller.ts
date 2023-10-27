import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { User } from 'src/models/users.model';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/getAll')
    async getAll(): Promise<User[]> {
        const users = await this.userService.getAll();
        return users;
    }
}
