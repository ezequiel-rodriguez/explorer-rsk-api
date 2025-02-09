import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  private readonly logger = new Logger(AddressesController.name);

  constructor(private addressService: AddressesService) {}

  @Get()
  getAllAddresses(
    @Query('page_data') page_data: number,
    @Query('take_data') take_data: number,
  ) {
    return this.addressService.getAddresses(page_data, Number(take_data));
  }

  @Get(':address')
  getAddress(@Param('address') address: string) {
    this.logger.log(`Fetching address details for ${address}`);
    return this.addressService.getAddress(address);
  }
  @Get('verification/:address')
  getContractVerification(@Param('address') address: string) {
    return this.addressService.getContractVerification(address);
  }
}
