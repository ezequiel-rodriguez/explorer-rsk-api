import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  constructor(
    private readonly fieldName: 'eventId' | 'transactionId' | 'internalTxId',
  ) {}

  transform(value: string): string {
    if (!value) {
      return undefined;
    }

    if (!/^[a-fA-F0-9]{32}$/.test(value)) {
      throw new BadRequestException(
        `Invalid ${this.fieldName}: "${value}". It must be a 32-character hexadecimal string.`,
      );
    }

    return value.toLowerCase();
  }
}
