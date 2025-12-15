import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginResponseDto, SignInDto, UserDto } from './dto/signIn.dto';

import { AuthGuard } from '@/src/modules/auth/auth.guard';
import { RequestWithJWTPayload } from '@/src/types/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, type: LoginResponseDto })
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

  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async singUp(@Body() signInDto: SignInDto) {
    console.log('REGISTER');
    await this.authService.signUp(signInDto);
  }

  @ApiBearerAuth() // берёт схему из .addBearerAuth() в main.ts
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user', type: UserDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithJWTPayload) {
    console.log('PROFILE');
    return this.authService.getProfile(req.user.sub);
  }

  @ApiCookieAuth('refresh_token') // просто пометка в схеме
  @ApiOperation({ summary: 'Refresh access token using refresh_token cookie' })
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Get('refresh')
  async refresh(
    @Req() req: RequestWithJWTPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
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
