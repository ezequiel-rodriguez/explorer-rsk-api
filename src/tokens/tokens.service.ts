import { BadRequestException, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { TokenParserService } from 'src/common/parsers/token-parser.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TokensService {
  constructor(
    private prisma: PrismaService,
    private tokenParser: TokenParserService,
  ) {}

  async getTokens(take: number, cursor?: number) {
    try {
      if (take < 0 && !cursor) {
        throw new BadRequestException(
          'Cannot paginate backward without a cursor.',
        );
      }

      const where = {
        type: 'contract',
        contract_contract_addressToaddress: {
          contract_interface: {
            some: {
              interface: {
                in: ['ERC20', 'ERC677', 'ERC721'],
              },
            },
          },
        },
      };

      const response = await this.prisma.address.findMany({
        take: take > 0 ? take + 1 : take - 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
        where,
        select: {
          id: true,
          address: true,
          name: true,
          type: true,
          contract_contract_addressToaddress: {
            select: {
              symbol: true,
            },
          },
          address_latest_balance_address_latest_balance_addressToaddress: {
            select: {
              balance: true,
              blockNumber: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      const hasMoreData = response.length > Math.abs(take);

      const paginatedTokens = hasMoreData
        ? response.slice(0, Math.abs(take))
        : response;

      const formattedData = this.tokenParser.formatTokens(paginatedTokens);

      const nextCursor =
        take > 0 && !hasMoreData
          ? null
          : formattedData[formattedData.length - 1]?.id;

      const prevCursor =
        !cursor || (take < 0 && !hasMoreData) ? null : formattedData[0]?.id;

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
      throw new Error(`Failed to fetch tokens: ${error.message}`);
    }
  }

  async getTokensByAddress(
    tokenAddress: string,
    take: number,
    cursor?: string,
  ) {
    try {
      if (take < 0 && !cursor) {
        throw new BadRequestException(
          'Cannot paginate backward without a cursor.',
        );
      }

      const parsedCursor = this.decodeCursor(cursor);

      const tokensWithDetails = await this.prisma.token_address.findMany({
        take: take > 0 ? take + 1 : take - 1,
        cursor: cursor
          ? {
              address_contract_blockNumber: {
                ...parsedCursor,
                address: tokenAddress,
              },
            }
          : undefined,
        skip: cursor ? 1 : undefined,
        where: { address: tokenAddress },
        orderBy: [
          { contract: 'asc' },
          { blockNumber: take > 0 ? 'desc' : 'asc' },
        ],
        include: {
          contract_token_address_contractTocontract: {
            select: {
              name: true,
            },
          },
          contract_details: {
            select: {
              symbol: true,
              decimals: true,
            },
          },
        },
        distinct: ['contract'],
      });

      const hasMoreData = tokensWithDetails.length > Math.abs(take);

      const paginatedResults = hasMoreData
        ? tokensWithDetails.slice(0, Math.abs(take))
        : tokensWithDetails;

      const formattedData = paginatedResults.map((token) => ({
        address: token.address,
        contract: token.contract,
        blockNumber: token.blockNumber,
        blockHash: token.blockHash,
        balance: token.balance
          ? new BigNumber(token.balance)
              .dividedBy(10 ** (token.contract_details?.decimals || 18))
              .toString()
          : '0',
        name:
          token.contract_token_address_contractTocontract?.name ||
          '(Not provided)',
        symbol: token.contract_details?.symbol || '(Not provided)',
        decimals: token.contract_details?.decimals || 18,
      }));

      const nextCursor =
        take > 0 && !hasMoreData
          ? null
          : this.encodeCursor(
              paginatedResults[paginatedResults.length - 1].contract,
              paginatedResults[paginatedResults.length - 1].blockNumber,
            );

      const prevCursor =
        !cursor || (take < 0 && !hasMoreData)
          ? null
          : this.encodeCursor(
              paginatedResults[0].contract,
              paginatedResults[0].blockNumber,
            );

      return {
        paginationData: { nextCursor, prevCursor, take, hasMoreData },
        data: formattedData,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to fetch tokens: ${error.message}`);
    }
  }

  encodeCursor = (contract: string, blockNumber: number) =>
    `${contract}_${blockNumber}`;

  decodeCursor = (cursor?: string) => {
    if (!cursor) return undefined;
    const [contract, blockNumber] = cursor.split('_');
    return { contract, blockNumber: parseInt(blockNumber, 10) };
  };

  async getTokenByNameOrSymbol(value: string) {
    try {
      const response = await this.prisma.address.findMany({
        take: 20,
        where: {
          OR: [
            {
              name: {
                contains: value,
                mode: 'insensitive',
              },
            },
            {
              contract_contract_addressToaddress: {
                symbol: {
                  contains: value,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        select: {
          address: true,
          name: true,
          contract_contract_addressToaddress: {
            select: {
              symbol: true,
            },
          },
        },
      });

      const formatData = response.map((t) => {
        return {
          address: t.address,
          name: t.name,
          symbol: t.contract_contract_addressToaddress.symbol,
        };
      });

      return {
        data: formatData,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to fetch tokens: ${error.message}`);
    }
  }
}
