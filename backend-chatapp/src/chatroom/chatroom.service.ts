import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getChatroom(id: string) {
    return this.prisma.chatroom.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  async createChatroom(name: string, sub: number) {
    const existingchatroom = this.prisma.chatroom.findFirst({
      where: {
        name: name,
      },
    });

    if (existingchatroom) {
      throw new BadRequestException({ name: 'Chatroom already exists' });
    }

    return this.prisma.chatroom.create({
      data: {
        name,
        users: {
          connect: {
            //tlinki relation mabin il chatroom wil user so thot il foreign key mte3 user wil chatroom
            id: sub,
          },
        },
      },
    });
  }

  async addUsersToChatroom(chatroomId: number, userIds: number[]) {
    const existingchatroom = this.prisma.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });
    if (!existingchatroom) {
      throw new BadRequestException({ name: 'Chatroom does not  exist' });
    }

    return await this.prisma.chatroom.update({
      where: {
        id: chatroomId,
      },
      data: {
        users: {
          connect: userIds.map((id) => ({ id: id })),
        },
      },
      include: {
        users: true, //return  the users
      },
    });
  }

  async getChatroomsForUser(userId: number) {
    return this.prisma.chatroom.findMany({
      where: {
        users: {
          some: {
            id: userId, //we will find all the chatrooms of a certain user here
          },
        },
      },
      include: {
        // here we will include all the other members of the chatroom
        users: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        messages: {
          //just to show the latest msg on the list   not the actual chat
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async sendMessage(
    chatroomId: number,
    message: string,
    userId: number,
    imagePath: string,
  ) {
    return await this.prisma.message.create({
      data: {
        content: message,
        imageUrl: imagePath,
        chatroomId,
        userId,
      },
      include: {
        chatroom: {
          include: {
            users: true,
          },
        },
        user: true,
      },
    });
  }

  async saveImage(image: {
    createReadStream: () => any;
    filename: string;
    mimetype: string;
  }) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(image.mimetype)) {
      throw new BadRequestException({ image: 'invalid emage type' });
    }
    const imageName = `${Date.now()}-${image.filename}`;
    const imagePath = `${this.configService.get('IMAGE_PATH')}/${imageName}`;
    const stream = image.createReadStream();
    const outputPath = `public${imagePath}`;
    const writeStream = createWriteStream(outputPath);
    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    return imagePath;
  }

  async getChatroomMessages(chatroomId: number) {
    const existingchatroom = this.prisma.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });
    if (!existingchatroom) {
      throw new BadRequestException({ name: 'Chatroom does not  exist' });
    }
    return await this.prisma.message.findMany({
      where: {
        chatroomId: chatroomId,
      },
      include: {
        chatroom: {
          include: {
            users: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async deletechatroom(chatroomId: number) {
    return this.prisma.chatroom.delete({
      where: {
        id: chatroomId,
      },
    });
  }
}
