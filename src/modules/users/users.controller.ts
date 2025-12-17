import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@/src/modules/auth/auth.guard';
import { UpdatePasswordDto, UpdateUserDto } from '@/src/modules/users/dto/users.dto';
import { UsersService } from '@/src/modules/users/users.service';

@ApiTags('Users')
@ApiBearerAuth() // требует Bearer из .addBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'Updated user entity' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    console.log('UPDATE USER');
    return this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
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
      oldPassword: updatePasswordDto.password,
      newPassword: updatePasswordDto.newPassword,
    });
  }
}
