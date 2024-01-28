import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'fullname is required' })
  @IsString({ message: 'fullname must be a string' })
  fullname: string;

  @Field()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'PAssword need to be at least 8 chqr' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Confirm Password required' })
  confirmPassword: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
