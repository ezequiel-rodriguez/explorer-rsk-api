import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItxsService } from './itxs.service';
import { BlockIdentifierPipe } from 'src/common/pipes/block-identifier.pipe';
import { PaginationTakeValidationPipe } from 'src/common/pipes/pagination-take.pipe';
import { TransactionHashValidationPipe } from 'src/common/pipes/transaction-hash.pipe';
import { AddressValidationPipe } from 'src/common/pipes/address-validation.pipe';
import { IdValidationPipe } from 'src/common/pipes/id-validation-pipe';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';

@Controller('itxs')
export class ItxsController {
  constructor(private itxsService: ItxsService) {}

  @Get(':id')
  getInternalTransactionById(
    @Param('id', new IdValidationPipe('internalTxId')) id: string,
  ) {
    return this.itxsService.getInternalTransactionById(id);
  }

  @Get('/block/:blockOrHash')
  getInternalTransactionsByBlock(
    @Param('blockOrHash', BlockIdentifierPipe) blockOrHash: string,
    @Query('take', PaginationTakeValidationPipe) take: number,
    @Query('cursor', new CursorValidationPipe('internalTxId'))
    cursor: { internalTxId: string },
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
    @Query('cursor', new CursorValidationPipe('internalTxId'))
    cursor: { internalTxId: string },
  ) {
    return this.itxsService.getInternalTransactionsByTransactionHash(
      transactionHash,
      take,
      cursor,
    );
  }

  @Get('/address/:address')
  getInternalTransactionsByAddress(
    @Param('address', AddressValidationPipe) address: string,
    @Query('take', PaginationTakeValidationPipe) take: number,
    @Query('cursor', new CursorValidationPipe('internalTxId_role'))
    cursor: { internalTxId: string; role: string },
  ) {
    return this.itxsService.getInternalTransactionsByAddress(
      address,
      take,
      cursor,
    );
  }
}
