import { ApiProperty } from '@nestjs/swagger';
import { RecordType } from '@prisma/generated/prisma/enums';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class CreateRecordLinkDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  url: string;
}

export class CreateNoteDto {
  @ApiProperty({ enum: RecordType, enumName: 'RecordType' })
  @IsEnum(RecordType)
  type: RecordType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({ required: false, description: 'Markdown/textarea' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;

  @ApiProperty({ type: [CreateRecordLinkDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecordLinkDto)
  links?: CreateRecordLinkDto[];
}
