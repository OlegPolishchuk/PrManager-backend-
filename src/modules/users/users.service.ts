import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/generated/prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { UpdateUserDto } from '@/src/modules/users/dto/users.dto';

type QueryOptions = Partial<{
  withoutPassword?: boolean;
}>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: string, options?: QueryOptions) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: options?.withoutPassword,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async createUser(email: string, password: string) {
    return this.prisma.user.create({
      data: { email: email, password: password },
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  async updatePassword({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException();

    const osPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!osPasswordCorrect) throw new BadRequestException('Wrong Password');

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
  }
}
