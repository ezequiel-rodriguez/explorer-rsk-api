import { Controller, Get, Param, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PaginationTakeValidationPipe } from 'src/common/pipes/pagination-take.pipe';
import { AddressValidationPipe } from 'src/common/pipes/address-validation.pipe';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get(':address')
  getAccounts(
    @Param('address', AddressValidationPipe) address: string,
    @Query('take', PaginationTakeValidationPipe) take?: number,
    @Query('cursor', new CursorValidationPipe('address_blockNumber'))
    cursor?: { address: string; blockNumber: number },
  ) {
    return this.accountsService.getAccountsByToken(address, take, cursor);
  }
}
