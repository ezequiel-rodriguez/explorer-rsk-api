import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { AddressValidationPipe } from 'src/common/pipes/address-validation.pipe';
import { PaginationTakeValidationPipe } from 'src/common/pipes/pagination-take.pipe';
import {
  AddressOrHash,
  AddressOrHashValidationPipe,
} from 'src/common/pipes/address-or-hash-validation.pipe';
import { IdValidationPipe } from 'src/common/pipes/id-validation-pipe';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  /**
   * Fetch transfer events by ID.
   * @param {string} id - Event ID.
   * @returns Transfer events details, including token deatils and transactions details.
   */
  @Get('/:id')
  getEventById(@Param('id', new IdValidationPipe('eventId')) id: string) {
    return this.eventsService.getEventById(id);
  }

  /**
   * Fetch a paginated list of events using keyset pagination.
   * @param {string} address - The address to filter events by.
   * @param {number} take - Number of records to retrieve.
   * @param {string} cursor - The eventID to start from (optional).
   * @returns Paginated events data by address & pagination.
   */
  @Get('/address/:address')
  getEventsByAddress(
    @Param('address', AddressValidationPipe) address: string,
    @Query('take', PaginationTakeValidationPipe) take?: number,
    @Query('cursor', new CursorValidationPipe('eventId'))
    cursor?: { eventId: string },
  ) {
    return this.eventsService.getEventsByAddress(address, take, cursor);
  }

  /**
   * Fetch transfer events by specific tx hash or address.
   * @param {string} addressOrhash - Transaction hash.
   * @param {number} take - Number of records to retrieve.
   * @param {string} cursor - The eventID to start from (optional).
   * @returns Transfer events data details by Tx Hash or address & pagination.
   */
  @Get('/transfer/:addressOrhash')
  getTransfersEventByTxHashOrAddress(
    @Param('addressOrhash', AddressOrHashValidationPipe)
    addressOrhash: AddressOrHash,
    @Query('take', PaginationTakeValidationPipe) take?: number,
    @Query('cursor', new CursorValidationPipe('eventId'))
    cursor?: { eventId: string },
  ) {
    return this.eventsService.getTransfersEventByTxHashOrAddress(
      addressOrhash,
      take,
      cursor,
    );
  }
}
