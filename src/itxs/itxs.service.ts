import { BadRequestException, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { TxParserService } from 'src/common/parsers/transaction-parser.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ItxsService {
  constructor(
    private prisma: PrismaService,
    private txParser: TxParserService,
  ) {}

  /**
   * Retrieves an internal transaction by its ID.
   *
   * @param {string} itxId - The internal transaction ID to fetch.
   * @returns - The internal transaction details.
   */
  async getInternalTransactionById(itxId: string) {
    try {
      if (!itxId) {
        throw new BadRequestException('Internal transaction ID is required.');
      }

      const internalTransaction =
        await this.prisma.internal_transaction.findFirst({
          where: { internalTxId: itxId },
          orderBy: { internalTxId: 'desc' },
        });

      if (!internalTransaction) {
        return { data: null };
      }

      internalTransaction.timestamp =
        internalTransaction.timestamp.toString() as unknown as bigint;

      const result = JSON.parse(internalTransaction.result) || {};
      const action = JSON.parse(internalTransaction.action) || {};

      action.gas = new BigNumber(action?.gas || '0', 16).toString();
      action.value = new BigNumber(action?.value || '0', 16)
        .dividedBy(1e18)
        .toString();
      result.gasUsed = new BigNumber(result?.gasUsed || '0', 16).toString();

      return {
        data: { ...internalTransaction, result, action },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(
        `Failed to fetch internal transactions: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves paginated internal transactions for a given block number or block hash.
   *
   * Uses cursor-based pagination to efficiently fetch transaction data.
   *
   * @param {number | string} blockOrHash - The block number or block hash to fetch transactions from.
   * @param {number} take - Number of transactions to retrieve. If negative, paginates backward.
   * @param {number} [cursor] - The ID of the last fetched transaction to enable keyset pagination.
   * @returns  - Paginated list of internal transactions.
   */
  async getInternalTransactionsByBlock(
    blockOrHash: number | string,
    take: number,
    cursor?: { internalTxId: string },
  ) {
    try {
      if (take < 0 && !cursor) {
        throw new BadRequestException(
          'Cannot paginate backward without a cursor.',
        );
      }

      const where =
        typeof blockOrHash === 'number'
          ? { blockNumber: blockOrHash }
          : { blockHash: blockOrHash };

      const transactions = await this.prisma.internal_transaction.findMany({
        take: take > 0 ? take + 1 : take - 1,
        cursor: cursor ? { internalTxId: cursor.internalTxId } : undefined,
        skip: cursor ? 1 : undefined,
        where,
        select: {
          type: true,
          timestamp: true,
          action: true,
          internalTxId: true,
          error: true,
        },
        orderBy: { internalTxId: 'desc' },
      });

      if (transactions.length === 0) {
        return {
          data: null,
        };
      }

      const hasMoreData = transactions.length > Math.abs(take);

      const paginatedTransactions = hasMoreData
        ? take > 0
          ? transactions.slice(0, Math.abs(take))
          : transactions.slice(1)
        : transactions;

      const formattedData = this.txParser.formatItxs(paginatedTransactions);

      const nextCursor =
        take > 0 && !hasMoreData
          ? null
          : formattedData[formattedData.length - 1]?.internalTxId;

      const prevCursor =
        !cursor || (take < 0 && !hasMoreData)
          ? null
          : formattedData[0]?.internalTxId;

      return {
        paginationData: {
          nextCursor,
          prevCursor,
          take,
          hasMoreData,
        },
        data: formattedData,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(
        `Failed to fetch internal transactions: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves paginated internal transactions for a given transaction hash.
   *
   * @param {string} transactionHash - The transaction hash to fetch transactions from.
   * @param {number} take - Number of transactions to retrieve. If negative, paginates backward.
   * @param {number} [cursor] - The ID of the last fetched transaction to enable keyset pagination.
   * @returns  - Paginated list of internal transactions.
   */
  async getInternalTransactionsByTransactionHash(
    transactionHash: string,
    take: number,
    cursor: { internalTxId: string },
  ) {
    try {
      const internalTransactions =
        await this.prisma.internal_transaction.findMany({
          take: take > 0 ? take + 1 : take - 1,
          cursor: cursor ? { internalTxId: cursor.internalTxId } : undefined,
          skip: cursor ? 1 : undefined,
          where: { transactionHash: transactionHash },
          orderBy: { internalTxId: 'desc' },
        });

      if (internalTransactions.length === 0) {
        return {
          data: null,
        };
      }

      const hasMoreData = internalTransactions.length > Math.abs(take);

      const paginatedInternalTransactions = hasMoreData
        ? take > 0
          ? internalTransactions.slice(0, Math.abs(take))
          : internalTransactions.slice(1)
        : internalTransactions;

      const formattedData = this.txParser.formatItxs(
        paginatedInternalTransactions,
      );

      const nextCursor =
        take > 0 && hasMoreData
          ? paginatedInternalTransactions[
              paginatedInternalTransactions.length - 1
            ]?.internalTxId
          : null;

      const prevCursor =
        !cursor || (take < 0 && !hasMoreData)
          ? null
          : paginatedInternalTransactions[0]?.internalTxId;

      return {
        paginationData: {
          nextCursor,
          prevCursor,
          take,
          hasMoreData,
        },
        data: formattedData,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(
        `Failed to fetch internal transactions: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves paginated internal transactions for a given address.
   *
   * @param address to fetch transactions internal transactions from.
   * @param {number} take - Number of transactions to retrieve. If negative, paginates backward.
   * @param {number} [cursor] - The ID of the last fetched transaction to enable keyset pagination.
   * @returns  - Paginated list of internal transactions.
   */
  async getInternalTransactionsByAddress(
    address: string,
    take: number,
    cursor?: { internalTxId: string; role: string },
  ) {
    try {
      const whereInternalTxId = cursor
        ? {
            internalTxId: {
              [take > 0 ? 'lt' : 'gt']: cursor.internalTxId,
            },
          }
        : {};

      const internalTransactions = await this.prisma.address_in_itx.findMany({
        take: take > 0 ? take + 1 : take - 1,
        where: {
          address,
          ...whereInternalTxId,
        },
        orderBy: [{ internalTxId: 'desc' }],
        select: {
          address: true,
          internalTxId: true,
          internal_transaction: {
            select: {
              type: true,
              timestamp: true,
              action: true,
              error: true,
            },
          },
          role: true,
        },
      });

      if (internalTransactions.length === 0) {
        return {
          data: null,
        };
      }

      const hasMoreData = internalTransactions.length > Math.abs(take);

      const paginatedResults = hasMoreData
        ? take > 0
          ? internalTransactions.slice(0, Math.abs(take))
          : internalTransactions.slice(1)
        : internalTransactions;

      const formattedData = paginatedResults.map((tx) => {
        const { internal_transaction, ...rest } = tx;
        return {
          ...rest,
          ...internal_transaction,
          timestamp: internal_transaction.timestamp.toString(),
          action: JSON.parse(internal_transaction.action || '{}'),
        };
      });

      const nextCursor =
        take > 0 && !hasMoreData
          ? null
          : this.encodeCursor(
              formattedData[formattedData.length - 1]?.internalTxId,
              formattedData[formattedData.length - 1]?.role,
            );

      const prevCursor =
        !cursor || (take < 0 && !hasMoreData)
          ? null
          : this.encodeCursor(
              formattedData[0]?.internalTxId,
              formattedData[0]?.role,
            );

      return {
        paginationData: {
          nextCursor,
          prevCursor,
          take,
          hasMoreData,
        },
        data: formattedData,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(
        `Failed to fetch internal transactions: ${error.message}`,
      );
    }
  }

  private encodeCursor = (internalTxId: string, role: string) =>
    `${internalTxId}_${role}`;
}
