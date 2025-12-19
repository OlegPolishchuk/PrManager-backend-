import { Module } from '@nestjs/common';

import { LinksController } from './links.controller';
import { LinksService } from './links.service';

import { PrismaModule } from '@/src/core/prisma/prisma.module';

@Module({
  controllers: [LinksController],
  providers: [LinksService],
  imports: [PrismaModule],
})
export class LinksModule {}
