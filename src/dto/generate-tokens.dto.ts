import { IsNumber, IsString, IsEmail } from 'class-validator';

export class GenerateTokensDto {
    @IsNumber({}, { message: 'Must be a number' })
    readonly userId: number;
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Invalid email address' })
    readonly email: string;
}
