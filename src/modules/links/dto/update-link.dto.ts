import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateLinkDto } from '@/src/modules/links/dto/create-link.dto';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  @ApiProperty()
  id: string;
}
