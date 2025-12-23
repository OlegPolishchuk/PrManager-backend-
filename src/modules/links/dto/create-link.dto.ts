import { ApiProperty } from '@nestjs/swagger';
import { LinkType } from '@prisma/generated/prisma/enums';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ enum: LinkType, enumName: 'LinkType' })
  @IsEnum(LinkType)
  type: LinkType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty({ type: [String], example: ['uuid1', 'uuid2'], required: false })
  @IsOptional()
  @IsArray()
  tagIds?: string[];
}
