import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SearchValidationPipe implements PipeTransform {
  constructor(private maxLength = 100) {}

  transform(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('Search query must be a valid string.');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      throw new BadRequestException('Search query cannot be empty.');
    }

    if (trimmedValue.length > this.maxLength) {
      throw new BadRequestException(
        `Search query is too long (max ${this.maxLength} characters).`,
      );
    }

    // Basic security check: Avoid script injections
    if (/["><]/.test(trimmedValue)) {
      throw new BadRequestException('Invalid characters in search query.');
    }

    return trimmedValue;
  }
}
