import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignInDto } from '@/src/modules/auth/dto/signIn.dto';
import { UsersService } from '@/src/modules/users/users.service';
import { Token } from '@/src/types/types';

export const BCRYPT_SALT_ROUNDS = 10;

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

    const isPasswordCorrect = await bcrypt.compare(signInDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
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

  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '5d',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const oldToken: Token = await this.jwtService.decode(refreshToken);

    const user = await this.userService.findOne(oldToken.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.getTokens(user.id, user.email);
  }

  async getProfile(userId: string) {
    return this.userService.findOne(userId, { withoutPassword: true });
  }
}
