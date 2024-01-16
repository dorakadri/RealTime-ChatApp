import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (ConfigService: ConfigService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],

  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
