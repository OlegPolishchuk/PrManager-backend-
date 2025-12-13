import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { SignInDto } from '@/src/modules/auth/dto/signIn.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async createUser(email: string, password: string) {
    return this.prisma.user.create({
      data: { email: email, password: password },
    });
  }
}
