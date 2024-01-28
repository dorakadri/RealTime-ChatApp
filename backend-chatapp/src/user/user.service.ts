import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDto } from './Dto/update-user.input';
import { join } from 'path';
import * as fs from 'fs';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async updateProfile(user: UpdateDto, userId: number) {
    if (user.avatarUrl) {
      const oldUser = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      const updateduser = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          ...user,
        },
      });
      if (oldUser.avatarUrl) {
        const imageName = oldUser.avatarUrl.split('/').pop();
        const imagepath = join(
          __dirname,
          '..',
          '..',
          'public',
          'images',
          imageName,
        );
        if (fs.existsSync(imagepath)) {
          fs.unlinkSync(imagepath);
        }
      }

      return updateduser;
    }
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        fullname: user.fullname,
      },
    });
  }
}
