import { Injectable } from '@nestjs/common';
import { event } from '@prisma/client';
import BigNumber from 'bignumber.js';

@Injectable()
export class EventParserService {
  constructor() {}

  /**
   * Format event data.
   * @param {event} event - Event data to format.
   * @returns Formatted event data.
   */
  formatOneEvent(event: event | any) {
    if (!event) return null;

    event.timestamp = event.timestamp.toString() as unknown as bigint;
    event.transaction.timestamp =
      event.transaction.timestamp.toString() as unknown as bigint;
    const receipt = JSON.parse(event.transaction.receipt);
    event.transaction.value = new BigNumber(
      event.transaction.value.toString(),
      16,
    )
      .dividedBy(1e18)
      .toNumber()
      .toString();
    const log = receipt?.logs?.filter((l) => l.eventId === event.eventId);
    receipt.logs = log;
    event.transaction.receipt = receipt;
    const contract_detail = {
      name: event.address_event_addressToaddress.name,
      symbol:
        event.address_event_addressToaddress.contract_contract_addressToaddress
          .symbol,
    };
    delete event.address_event_addressToaddress;
    return {
      ...event,
      contract_detail,
    };
  }

  /**
   * Format event data.
   * @param {event[]} events - Event data to format.
   * @returns Formatted event data.
   */
  formatTransferEvent(events: event[] | unknown[]) {
    if (events?.length === 0 || events === null) return null;
    const formattedData = events.map((e) => {
      e.timestamp = e.timestamp.toString() as unknown as bigint;
      e.args = JSON.parse(e.args);
      let totalSupply = 0;
      if (e.args?.length === 3) {
        totalSupply = new BigNumber(e.args[2].toString())
          .dividedBy(new BigNumber(10).pow(18))
          .toNumber();
      }
      const contract_detail = {
        name: e.address_event_addressToaddress.name,
        symbol:
          e.address_event_addressToaddress.contract_contract_addressToaddress
            .symbol,
      };
      const contract_interface =
        e?.address_event_addressToaddress.contract_contract_addressToaddress
          ?.contract_interface;
      delete e.address_event_addressToaddress;
      return {
        ...e,
        totalSupply,
        contract_detail,
        contract_interface: contract_interface?.map((c) => c.interface),
      };
    });

    return formattedData;
  }
}
