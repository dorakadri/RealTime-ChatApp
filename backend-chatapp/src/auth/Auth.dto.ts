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
  @IsNotEmpty({ message: 'fullname is required' })
  @MinLength(8, { message: 'fullname must be a string' })
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
