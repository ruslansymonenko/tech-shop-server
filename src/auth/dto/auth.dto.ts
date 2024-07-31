import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString({
    message: 'Email is required!',
  })
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long!' })
  @IsString({
    message: 'Password required!',
  })
  password: string;
}
