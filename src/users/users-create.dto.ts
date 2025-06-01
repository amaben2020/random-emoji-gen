import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsNumber,
} from 'class-validator';
import { User } from './user.entity';

export class UsersCreateDto
  implements Pick<User, 'email' | 'firstName' | 'lastName'>
{
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(90)
  firstName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(90)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

export class GetUserParamDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
