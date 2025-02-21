import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/prisma.service';
import { EventParserService } from 'src/events/parser/event-parser.service';

@Module({
  providers: [EventsService, PrismaService, EventParserService],
  controllers: [EventsController],
})
export class EventsModule {}
