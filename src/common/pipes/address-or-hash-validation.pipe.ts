import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { isAddress, isTransactionHash } from '../utils/validation.utils';

export type AddressOrHash = {
  type: 'address' | 'transactionHash';
  value: string;
};

@Injectable()
export class AddressOrHashValidationPipe implements PipeTransform {
  transform(value: string): AddressOrHash {
    if (!isAddress(value) && !isTransactionHash(value)) {
      throw new BadRequestException(
        `Invalid input: "${value}". Must be a valid 40-character address or a 64-character hash.`,
      );
    }

    return {
      type: isAddress(value) ? 'address' : 'transactionHash',
      value,
    };
  }
}
