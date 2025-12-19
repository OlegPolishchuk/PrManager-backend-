import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { CreateLinkDto } from '@/src/modules/links/dto/create-link.dto';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  @ApiProperty()
  @IsUUID()
  id: string;
}
