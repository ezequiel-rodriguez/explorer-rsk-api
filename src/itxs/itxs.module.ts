import { Module } from '@nestjs/common';
import { ItxsService } from './itxs.service';
import { ItxsController } from './itxs.controller';
import { PrismaService } from 'src/prisma.service';
import { TxParserService } from 'src/common/parsers/transaction-parser.service';

@Module({
  providers: [ItxsService, PrismaService, TxParserService],
  controllers: [ItxsController],
})
export class ItxsModule {}
