import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@/src/modules/auth/auth.guard';
import { UpdatePasswordDto, UpdateUserDto } from '@/src/modules/users/dto/users.dto';
import { UsersService } from '@/src/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    console.log('UPDATE USER');
    return this.userService.updateUser(id, updateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':id/password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id') id: string,
  ) {
    console.log('UPDATE PASSWORD');
    return this.userService.updatePassword({
      userId: id,
      oldPassword: updatePasswordDto.oldPassword,
      newPassword: updatePasswordDto.newPassword,
    });
  }
}
