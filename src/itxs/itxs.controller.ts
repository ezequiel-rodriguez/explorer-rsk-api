import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItxsService } from './itxs.service';
import { BlockIdentifierPipe } from 'src/common/pipes/block-identifier.pipe';
import { PaginationTakeValidationPipe } from 'src/common/pipes/pagination-take.pipe';

@Controller('itxs')
export class ItxsController {
  constructor(private itxsService: ItxsService) {}

  @Get(':id')
  getInternalTransactionById(@Param('id') id: string) {
    // add txId Validation Pipe
    return this.itxsService.getInternalTransactionById(id);
  }

  @Get('/block/:blockOrhash')
  getInternalTransactionsByBlock(
    @Param('blockOrhash', BlockIdentifierPipe) blockOrhash: string,
    @Query('take', PaginationTakeValidationPipe) take: number,
    @Query('cursor') cursor: string,
  ) {
    return this.itxsService.getInternalTransactionsByBlock(
      blockOrhash,
      take,
      cursor,
    );
  }

  @Get('/tx/:hash')
  getIinternalTxsByTxHash(
    @Query('page_data') page_data: number,
    @Query('take_data') take_data: number,
    @Param('hash') hash: string,
  ) {
    return this.itxsService.getIinternalTxsByTxHash(hash, page_data, take_data);
  }

  @Get('/address/:address')
  getInternalTxsByAddress(
    @Query('page_data') page_data: number,
    @Query('take_data') take_data: number,
    @Param('address') address: string,
  ) {
    return this.itxsService.getInternalTxsByAddress(
      address,
      page_data,
      take_data,
    );
  }
}
