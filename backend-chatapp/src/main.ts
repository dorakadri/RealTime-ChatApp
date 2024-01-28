import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, 
    allowedHeaders: [
      'Accept',
      'Authorization',
      'content-type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
  });
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFilesSize: 1000000000, maxFiles: 1 }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints).join(
            ', ',
          );
          return accumulator;
        }, {});
        console.log(formattedErrors);
        console.log("dnc")
        throw new BadRequestException(formattedErrors);
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
