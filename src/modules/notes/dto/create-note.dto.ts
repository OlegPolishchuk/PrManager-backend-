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

// DTO для одной строки внутри группы (без type)
export class CreateRecordItemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({ type: [CreateRecordLinkDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecordLinkDto)
  links?: CreateRecordLinkDto[];
}

// Если тебе всё ещё нужен DTO “record” где есть type (например для других ручек) — оставь
export class CreateRecordDto extends CreateRecordItemDto {
  @ApiProperty({ enum: RecordType, enumName: 'RecordType' })
  @IsEnum(RecordType)
  type: RecordType;
}

export class CreateNoteDto {
  @ApiProperty({ enum: RecordType, enumName: 'RecordType' })
  @IsEnum(RecordType)
  type: RecordType;

  @ApiProperty({ required: false, description: 'Group title (only for non-NOTE types)' })
  @IsOptional()
  @IsString()
  groupTitle?: string;

  @ApiProperty({ type: [CreateRecordItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecordItemDto)
  records?: CreateRecordItemDto[];

  @ApiProperty({ required: false, description: 'Markdown/text note (only for NOTE)' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;
}
