import { ApiProperty } from '@nestjs/swagger';
import { RecordType } from '@prisma/generated/prisma/enums';

export class RecordLinkDto {
  @ApiProperty() id: string;
  @ApiProperty() recordId: string;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty() url: string;
}

export class RecordItemDto {
  @ApiProperty() id: string;

  @ApiProperty() recordId: string;

  @ApiProperty() title: string;

  @ApiProperty() value: string;
}

export class NoteDto {
  @ApiProperty() id: string;

  @ApiProperty({ enum: RecordType, enumName: 'RecordType' })
  type: RecordType;

  // NOTE
  @ApiProperty({ required: false, description: 'Markdown/text note (only for NOTE)' })
  note?: string;

  // НЕ NOTE
  @ApiProperty({ required: false, description: 'Group title (only for non-NOTE types)' })
  groupTitle?: string;

  @ApiProperty({
    type: [RecordItemDto],
    description: 'Group records (title/value pairs)',
  })
  records: RecordItemDto[];

  @ApiProperty({ type: [RecordLinkDto], description: 'Record links' })
  links: RecordLinkDto[];

  @ApiProperty() projectId: string;

  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class PaginatedProjectRecordsResponseDto {
  @ApiProperty({ type: [NoteDto] })
  data: NoteDto[];

  @ApiProperty() totalCount: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
}
