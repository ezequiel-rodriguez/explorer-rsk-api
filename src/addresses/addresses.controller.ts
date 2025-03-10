import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { PaginationTakeValidationPipe } from 'src/common/pipes/pagination-take.pipe';
import { AddressValidationPipe } from 'src/common/pipes/address-validation.pipe';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';

@Controller('addresses')
export class AddressesController {
  private readonly logger = new Logger(AddressesController.name);

  constructor(private addressService: AddressesService) {}

  /**
   * Fetches a paginated list of all addresses.
   *
   * @param {number} [take] - Number of addresses to retrieve per request. Defaults to TAKE_PAGE_DATA if not provided.
   * @param {number} [cursor] - The ID of the last fetched address to support keyset pagination. Retrieves addresses with IDs less than this value.
   * @returns A paginated list of addresses with associated details like balances and block numbers.
   */
  @Get()
  getAllAddresses(
    @Query('take', PaginationTakeValidationPipe) take?: number,
    @Query('cursor', new CursorValidationPipe('number'))
    cursor?: { id: number },
  ) {
    return this.addressService.getAddresses(take, cursor);
  }

  /**
   * Fetches detailed information about a specific address.
   *
   * @param {string} address - The blockchain address to retrieve details for.
   * @returns Address details, including balance, transactions, contract information (if applicable), and block number.
   */
  @Get(':address')
  getAddress(@Param('address', AddressValidationPipe) address: string) {
    this.logger.log(`Fetching address details for ${address}`);
    return this.addressService.getAddress(address);
  }

  /**
   * Fetches the verification status of a specific contract address.
   *
   * @param {string} address - The contract address to check verification status for.
   * @returns Verification status of the contract.
   */
  @Get('verification/:address')
  getContractVerification(
    @Param('address', AddressValidationPipe) address: string,
  ) {
    return this.addressService.getContractVerification(address);
  }
}
