import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { MAX_INT_4_BYTES } from '../constants';

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
      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(entity);
      const parsedBlockNumber = parseInt(blockNumber, 10);

      if (!isValidAddress) {
        throw new BadRequestException(
          `Invalid address format in cursor: ${entity}`,
        );
      }

      if (isNaN(parsedBlockNumber) || parsedBlockNumber < 0) {
        throw new BadRequestException(
          `Invalid blockNumber in cursor: ${blockNumber}`,
        );
      }

      if (parsedBlockNumber > MAX_INT_4_BYTES) {
        throw new BadRequestException(
          `blockNumber in cursor exceeds max allowed value: ${blockNumber}`,
        );
      }

      return {
        [entityName]: entity,
        blockNumber: parsedBlockNumber,
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

      const parsedBlockNumber = parseInt(blockNumber, 10);
      const parsedTransactionIndex = parseInt(transactionIndex, 10);

      if (isNaN(parsedBlockNumber) || parsedBlockNumber < 0) {
        throw new BadRequestException(
          `Invalid blockNumber in cursor: ${blockNumber}`,
        );
      }

      if (isNaN(parsedTransactionIndex) || parsedTransactionIndex < 0) {
        throw new BadRequestException(
          `Invalid transactionIndex in cursor: ${transactionIndex}`,
        );
      }

      if (parsedBlockNumber > MAX_INT_4_BYTES) {
        throw new BadRequestException(
          `blockNumber in cursor exceeds max allowed value: ${blockNumber}`,
        );
      }

      if (parsedTransactionIndex > MAX_INT_4_BYTES) {
        throw new BadRequestException(
          `transactionIndex in cursor exceeds max allowed value: ${blockNumber}`,
        );
      }

      return {
        blockNumber: parsedBlockNumber,
        transactionIndex: parsedTransactionIndex,
      };
    }

    if (this.expectedFormat === 'number') {
      if (!value) return undefined;

      const numericValue = parseInt(value, 10);

      if (isNaN(numericValue)) {
        throw new BadRequestException(`"cursor" must be an integer.`);
      }

      if (numericValue < 0) {
        throw new BadRequestException(
          `"cursor" must be a non-negative integer.`,
        );
      }

      if (numericValue > MAX_INT_4_BYTES) {
        throw new BadRequestException(
          `blockNumber in cursor exceeds max allowed value: ${numericValue}`,
        );
      }

      return { id: numericValue };
    }

    if (
      this.expectedFormat === 'eventId' ||
      this.expectedFormat === 'transactionId' ||
      this.expectedFormat === 'internalTxId'
    ) {
      if (!value) return undefined;

      if (!/^[a-fA-F0-9]{32}$/.test(value)) {
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

      if (!/^[a-fA-F0-9]{32}$/.test(internalTxId)) {
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
