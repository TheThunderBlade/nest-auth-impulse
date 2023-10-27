import { IsString, Length, IsEmail } from 'class-validator';

export class SignUpDto {
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Invalid email address' })
    readonly email: string;
    @IsString({ message: 'Must be a string' })
    @Length(5, 20, { message: 'Password must have from 5 and 20 characters' })
    readonly password: string;
}
