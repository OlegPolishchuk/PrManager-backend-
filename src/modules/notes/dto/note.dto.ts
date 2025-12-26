import { ApiProperty } from '@nestjs/swagger';
import { RecordType } from '@prisma/generated/prisma/enums';

import { ProjectDto } from '@/src/modules/projects/dto/projects.dto';

export class RecordLinkDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  recordId: string;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  url: string;
}

export class NoteDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: RecordType, enumName: 'RecordType' })
  type: RecordType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ type: [RecordLinkDto], description: 'Note links' })
  links: RecordLinkDto[];

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class PaginatedNotesResponseDto {
  @ApiProperty({ type: [NoteDto] })
  data: NoteDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
