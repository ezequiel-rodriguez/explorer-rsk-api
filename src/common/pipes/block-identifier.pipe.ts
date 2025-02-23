import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isBlockNumber, isTransactionHash } from '../utils/validation.utils';

@Injectable()
export class BlockIdentifierPipe implements PipeTransform {
  transform(value: string): number | string {
    if (isTransactionHash(value)) {
      return value;
    }

    if (isBlockNumber(value)) {
      return parseInt(value, 10);
    }

    throw new BadRequestException(
      `Invalid block identifier: ${value}. Must be a 64-character hex string or a non-negative integer.`,
    );
  }
}
