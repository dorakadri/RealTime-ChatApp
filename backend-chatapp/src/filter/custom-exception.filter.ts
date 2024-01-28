
import { ArgumentsHost, Catch, BadRequestException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch(BadRequestException)
export class GraphQLErrorFilter implements GqlExceptionFilter {
  catch(exception: BadRequestException) {
    const response = exception.getResponse();
    if (typeof response === 'object') {
      throw new ApolloError('Validation Error', 'VALIDATION_ERROR', response);
    } else throw new ApolloError('bad Request');
  }
}
