import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import {
  isAddress,
  isBlockNumber,
  isHex32,
  isTransactionIndex,
} from '../utils/validation.utils';

@Injectable()
export class CursorValidationPipe implements PipeTransform {
  constructor(
    private expectedFormat:
      | 'address_blockNumber'
      | 'contract_blockNumber'
      | 'blockNumber_transactionIndex'
      | 'number'
      | 'eventId'
      | 'transactionId'
      | 'internalTxId'
      | 'internalTxId_role',
  ) {}

  transform(value: string): { [key: string]: string | number } {
    if (!value) {
      return undefined;
    }

    let parts: string[];

    if (
      this.expectedFormat === 'address_blockNumber' ||
      this.expectedFormat === 'contract_blockNumber'
    ) {
      parts = value.split('_');
      const entityName = this.expectedFormat.split('_')[0];

      if (parts.length !== 2) {
        throw new BadRequestException(
          `Invalid cursor format. Expected format: "${this.expectedFormat}". Received: "${value}".`,
        );
      }

      const [entity, blockNumber] = parts;

      if (!isAddress(entity)) {
        throw new BadRequestException(
          `Invalid address format in cursor: ${entity}`,
        );
      }

      if (!isBlockNumber(blockNumber)) {
        throw new BadRequestException(
          `Invalid blockNumber in cursor: ${blockNumber}`,
        );
      }

      return {
        [entityName]: entity,
        blockNumber: parseInt(blockNumber, 10),
      };
    }

    if (this.expectedFormat === 'blockNumber_transactionIndex') {
      parts = value.split('_');
      if (parts.length !== 2) {
        throw new BadRequestException(
          `Invalid cursor format. Expected format: "blockNumber_transactionIndex". Received: "${value}".`,
        );
      }

      const [blockNumber, transactionIndex] = parts;

      if (!isBlockNumber(blockNumber)) {
        throw new BadRequestException(
          `Invalid blockNumber in cursor: ${blockNumber}`,
        );
      }

      if (!isTransactionIndex(transactionIndex)) {
        throw new BadRequestException(
          `Invalid transactionIndex in cursor: ${transactionIndex}`,
        );
      }

      return {
        blockNumber: parseInt(blockNumber, 10),
        transactionIndex: parseInt(transactionIndex, 10),
      };
    }

    if (this.expectedFormat === 'number') {
      if (!value) return undefined;

      if (!isBlockNumber(value)) {
        throw new BadRequestException(
          `Invalid cursor: "${value}" must an integer greater or equal than 0.`,
        );
      }

      return { id: parseInt(value, 10) };
    }

    if (
      this.expectedFormat === 'eventId' ||
      this.expectedFormat === 'transactionId' ||
      this.expectedFormat === 'internalTxId'
    ) {
      if (!value) return undefined;

      if (!isHex32(value)) {
        throw new BadRequestException(
          `Invalid cursor: "${value}" must be a 32-character hexadecimal string.`,
        );
      }

      return { [this.expectedFormat]: value.toLowerCase() };
    }

    if (this.expectedFormat === 'internalTxId_role') {
      parts = value.split('_');
      if (parts.length !== 2) {
        throw new BadRequestException(
          `Invalid cursor format. Expected format: "internalTxId_role". Received: "${value}".`,
        );
      }

      const [internalTxId, role] = parts;

      if (!isHex32(internalTxId)) {
        throw new BadRequestException(
          `Invalid internalTxId format in cursor: ${internalTxId}`,
        );
      }

      if (role !== 'to' && role !== 'from') {
        throw new BadRequestException('Invalid cursor role.');
      }

      return {
        internalTxId,
        role,
      };
    }

    throw new BadRequestException(
      `Unknown cursor format: ${this.expectedFormat}`,
    );
  }
}
