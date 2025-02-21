import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItxsService } from './itxs.service';
import { BlockIdentifierPipe } from 'src/common/pipes/block-identifier.pipe';
import { PaginationTakeValidationPipe } from 'src/common/pipes/pagination-take.pipe';
import { TransactionHashValidationPipe } from 'src/common/pipes/transaction-hash.pipe';

@Controller('itxs')
export class ItxsController {
  constructor(private itxsService: ItxsService) {}

  @Get(':id')
  getInternalTransactionById(@Param('id') id: string) {
    // add txId Validation Pipe
    return this.itxsService.getInternalTransactionById(id);
  }

  @Get('/block/:blockOrHash')
  getInternalTransactionsByBlock(
    @Param('blockOrHash', BlockIdentifierPipe) blockOrHash: string,
    @Query('take', PaginationTakeValidationPipe) take: number,
    @Query('cursor') cursor: string,
  ) {
    return this.itxsService.getInternalTransactionsByBlock(
      blockOrHash,
      take,
      cursor,
    );
  }

  @Get('/tx/:transactionHash')
  getInternalTransactionsByTransactionHash(
    @Param('transactionHash', TransactionHashValidationPipe)
    transactionHash: string,
    @Query('take', PaginationTakeValidationPipe) take: number,
    @Query('cursor') cursor: string,
  ) {
    return this.itxsService.getInternalTransactionsByTransactionHash(
      transactionHash,
      take,
      cursor,
    );
  }

  @Get('/address/:address')
  getInternalTxsByAddress(
    @Param('address') address: string,
    @Query('take', PaginationTakeValidationPipe) take: number,
    @Query('cursor') cursor: string,
  ) {
    return this.itxsService.getInternalTransactionsByAddress(
      address,
      take,
      cursor,
    );
  }
}
