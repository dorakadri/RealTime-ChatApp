import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtService, PrismaService],
})
export class AuthModule {}
