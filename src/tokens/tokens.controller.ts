import { Controller, Get, Param, Query } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { PaginationTakeValidationPipe } from 'src/common/pipes/pagination-take.pipe';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';
import { AddressValidationPipe } from 'src/common/pipes/address-validation.pipe';
import { SearchValidationPipe } from 'src/common/pipes/search-validation.pipe';

@Controller('tokens')
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Get()
  getTokens(
    @Query('take', PaginationTakeValidationPipe) take?: number,
    @Query('cursor', new CursorValidationPipe('number'))
    cursor?: { id: number },
  ) {
    return this.tokensService.getTokens(take, cursor);
  }

  @Get('/address/:address')
  getTokensByAddress(
    @Param('address', AddressValidationPipe) address: string,
    @Query('take', PaginationTakeValidationPipe) take?: number,
    @Query('cursor', new CursorValidationPipe('contract_blockNumber'))
    cursor?: { contract: string; blockNumber: number },
  ) {
    return this.tokensService.getTokensByAddress(address, take, cursor);
  }

  @Get('/search/:value')
  getTokenByNameOrSymbol(
    @Param('value', new SearchValidationPipe(30)) value: string,
  ) {
    return this.tokensService.getTokenByNameOrSymbol(value);
  }
}
