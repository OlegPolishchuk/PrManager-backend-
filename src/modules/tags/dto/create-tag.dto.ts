import { ApiProperty } from '@nestjs/swagger';
import { Link } from '@prisma/generated/prisma/client';
import { MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @MinLength(2)
  name: string;
}
