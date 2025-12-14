import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';

import { AuthGuard } from '@/src/modules/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    console.log('LOGIN');
    const { accessToken, refreshToken } = await this.authService.signIn(signInDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });

    return { accessToken };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async singUp(@Body() signInDto: SignInDto) {
    console.log('REGISTER');
    await this.authService.signUp(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    console.log('PROFILE');
    return req.user;
  }

  @HttpCode(HttpStatus.CREATED)
  @Get('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log('REFRESH');
    const refreshToken = req.cookies?.['refresh_token'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    // обновляем cookie (ротация)
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });

    return { accessToken };
  }
}
