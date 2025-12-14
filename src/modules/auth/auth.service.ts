import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { BCRYPT_SALT_ROUNDS } from '@/src/lib/constants/constants';
import { SignInDto } from '@/src/modules/auth/dto/signIn.dto';
import { UsersService } from '@/src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await bcrypt.compare(user?.password, signInDto.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signInDto: SignInDto) {
    const user = await this.userService.findOneByEmail(signInDto.email);

    if (user) {
      throw new BadRequestException('User with email already exists', {
        cause: new Error(),
        description: 'User with email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(signInDto.password, BCRYPT_SALT_ROUNDS);

    const newUser = await this.userService.createUser(signInDto.email, hashedPassword);

    return newUser;
  }
}
