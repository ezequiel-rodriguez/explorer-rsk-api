import { BadRequestException, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { TxParserService } from 'src/common/parsers/transaction-parser.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ItxsService {
  constructor(
    private prisma: PrismaService,
    private pgService: PaginationService,
    private txParser: TxParserService,
  ) {}

  async getInternalTxById(itxId: string) {
    const itx = await this.prisma.internal_transaction.findFirst({
      where: {
        internalTxId: itxId,
      },
      orderBy: {
        internalTxId: 'desc',
      },
    });
    itx.timestamp = itx.timestamp.toString() as unknown as bigint;
    const result = JSON.parse(itx.result) || {};
    const action = JSON.parse(itx.action);

    const gas = new BigNumber(action.gas.toString(), 16).toNumber().toString();

    const gasUsed = new BigNumber(result?.gasUsed?.toString() || '0', 16)
      .toNumber()
      .toString();

    action.gas = gas;
    action.value = new BigNumber(action.value.toString(), 16)
      .dividedBy(1e18)
      .toNumber()
      .toString();
    result.gasUsed = gasUsed || 0;
    itx.action = action;
    itx.result = result;
    return {
      data: itx,
    };
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
    cursor?: string,
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
        cursor: cursor ? { internalTxId: cursor } : undefined,
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
          pagination: { nextCursor: null, prevCursor: null, take },
          data: [],
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

  async getIinternalTxsByTxHash(
    hash: string,
    page_data: number,
    take_data: number,
  ) {
    const where: any = {};
    if (hash) where.transactionHash = hash;

    const count = await this.prisma.internal_transaction.count({ where });

    const pagination = this.pgService.paginate({
      page_data,
      take_data,
      count,
    });

    const response = await this.prisma.internal_transaction.findMany({
      where: {
        transactionHash: hash,
      },
      orderBy: {
        internalTxId: 'desc',
      },
    });

    const formatData = this.txParser.formatItxs(response);

    return {
      pagination,
      data: formatData,
    };
  }

  async getInternalTxsByAddress(
    address: string,
    page_data: number,
    take_data: number,
  ) {
    const where = {
      address,
    };
    const count = await this.prisma.address_in_itx.count({ where });

    const pagination = this.pgService.paginate({
      page_data,
      take_data,
      count,
    });
    const response = await this.prisma.address_in_itx.findMany({
      take: pagination.take,
      skip: pagination.skip,
      where,
      include: {
        internal_transaction: true,
      },
      orderBy: {
        internalTxId: 'desc',
      },
    });

    const formatData = response.map((tx) => {
      const { internal_transaction, ...result } = tx;
      internal_transaction.timestamp =
        internal_transaction.timestamp.toString() as unknown as bigint;

      internal_transaction.action = JSON.parse(internal_transaction.action);
      return {
        ...result,
        ...internal_transaction,
      };
    });
    return {
      pagination,
      data: formatData,
    };
  }
}
