import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { isTransactionHash } from '../utils/validation.utils';

@Injectable()
export class TransactionHashValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return undefined;
    }

    if (!isTransactionHash(value)) {
      throw new BadRequestException(
        `Invalid input: "${value}". Must be a valid a 64-character hash.`,
      );
    }

    return value.toLowerCase();
  }
}
