import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/generated/prisma/enums';
import { IsOptional } from 'class-validator';

export class ProjectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  color?: string;

  @ApiProperty()
  @IsOptional()
  icon?: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  projectStatus: ProjectStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedProjectsResponseDto {
  @ApiProperty({ type: [ProjectDto] })
  data: ProjectDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
