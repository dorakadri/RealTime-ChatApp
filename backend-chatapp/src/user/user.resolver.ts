import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './user.service';
import { User } from './user.type';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { UpdateDto } from './Dto/update-user.input';
import { Request } from 'express';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateProfile(
    @Args('fullname') fullname: string,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload.FileUpload,
    @Context() context: { req: Request },
  ) {
    const imageUrl = file ? await this.storeImageAndGetUrl(file) : null;
    const userId = context.req.user.sub;
    const user = new UpdateDto();
    user.fullname = fullname;
    if (imageUrl) {
      user.avatarUrl = imageUrl;
    }

    return this.userService.updateProfile(user, userId);
  }

  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const unisuqeFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public','images', unisuqeFilename);
    const imageUrl = `${process.env.APP_URL}/${unisuqeFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }
}
