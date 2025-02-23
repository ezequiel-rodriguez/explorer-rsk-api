import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isAddress } from '../utils/validation.utils';

@Injectable()
export class AddressValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('Address should not be empty.');
    }

    if (!isAddress(value)) {
      throw new BadRequestException(`Invalid address format: ${value}`);
    }

    return value.toLowerCase();
  }
}
