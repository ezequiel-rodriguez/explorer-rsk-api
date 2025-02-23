import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { isHex32 } from '../utils/validation.utils';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  constructor(
    private readonly fieldName: 'eventId' | 'transactionId' | 'internalTxId',
  ) {}

  transform(value: string): string {
    if (!value) {
      return undefined;
    }

    if (!isHex32(value)) {
      throw new BadRequestException(
        `Invalid ${this.fieldName}: "${value}". It must be a 32-character hexadecimal string.`,
      );
    }

    return value.toLowerCase();
  }
}
