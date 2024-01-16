import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDto } from './Dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async updateProfile(user: UpdateDto, userId: number) {
    if (user.avatarUrl) {
      return await this.prismaService.user.update({
        where: { id: userId },
        data: {
          ...user,
        },
      });
    }
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        fullname: user.fullname,
      },
    });
  }
}
