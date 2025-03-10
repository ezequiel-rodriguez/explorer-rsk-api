import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/prisma.service';
import { TxParserService } from 'src/common/parsers/transaction-parser.service';

@Module({
  providers: [TransactionsService, PrismaService, TxParserService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
