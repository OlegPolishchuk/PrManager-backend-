import { ApiProperty } from '@nestjs/swagger';
import { LinkType } from '@prisma/generated/prisma/enums';

import { TagDto } from '@/src/modules/tags/dto/tag.dto';

export class LinkDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ enum: LinkType, enumName: 'LinkType' })
  type: LinkType;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty({ type: [TagDto], description: 'List of tags' })
  tags: TagDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
