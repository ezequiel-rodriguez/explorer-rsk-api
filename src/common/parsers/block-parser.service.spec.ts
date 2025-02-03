import { Test, TestingModule } from '@nestjs/testing';
import { BlockParserService } from './block-parser.service';

describe('BlockParserService', () => {
  let service: BlockParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockParserService],
    }).compile();

    service = module.get<BlockParserService>(BlockParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatBlock', () => {
    it('should correctly format an array of blocks', () => {
      const mockBlocks = [
        {
          id: 'd04ae81d-0191-4311-9f7f-9ba3052ef4a8',
          number: 11763,
          hash: '0x0618cf5e6f68a2ae62261455222e39b598452e004daab6d67939c066ddf80a10',
          parentHash:
            '0x95dcfeecb9b3d15de463fdcae2c3b84d05d0adfcd003039894e250bd2b333581',
          sha3Uncles:
            '0xeceeb6d81804f8c0dd17c636be2888131fd327c6b7993a5e07a267790169b71f',
          logsBloom:
            '0x00000008000000800000000000000000000000000000000000000000000008000000000000040000000000000000000050000000000000000000000000000000000000000000000000000000005000000010000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000200000000000001040000000000000400000000000000000000100000000000000010000000000000000000001000000000000001000001000000000000000000000000000020000000000080200000100000000000000000000000000000000000000000000000000000000000000000000000',
          transactionsRoot:
            '0x231800faa975df539f3a3234d6ae5ec3308d1ecd9d7355e35efd314952f98e66',
          stateRoot:
            '0x0b0396e04adf8168852aca3b978318ccfe11210317c24b6dc094feca4c627284',
          receiptsRoot:
            '0x56840aee24a3bf7b78fa2feaa8f953377dad862795365ea30b4c581df5d476cf',
          miner: '0x1fab9a0e24ffc209b01faa5a61ad4366982d0b7f',
          difficulty: '0x1f75d03c',
          totalDifficulty: '0xd5970594f82',
          extraData: '0x',
          size: 1889,
          gasLimit: 6800000,
          gasUsed: 0,
          timestamp: 1562717375,
          transactions:
            '["0xcebf969f4a2312967e0c1ce8b0a5019e16a219f54f70c96940eea8b72e6bbd98"]',
          uncles:
            '["0x64c505d802d0b71d120856f7ac5fef1bffd6e22f438a0b1d4e08dd8f13702be1"]',
          minimumGasPrice: '0x0',
          bitcoinMergedMiningHeader:
            '0x0000002004457ab7952afda9818aa2b423ff0b6301b336c18376f0047502000000000000871c405d2415e3265e17dcdb9d8a338d9dd0d9dd2a70619eb3ba48d62f0cdeead82c255d531d041ac3b29344',
          bitcoinMergedMiningCoinbaseTransaction:
            '0x0000000000000080860921cb2564bb9567db247922d4733f7d54079881f8671a20c8061d281d25706088ac0000000000000000266a24aa21a9ed0c697599f6886da0e902370163a0aa00e5999ec3d78da2f770b5a5bcf0a912f800000000000000002a6a52534b424c4f434b3a48f014a065ac24175b1790e67f8f5f5b9713649107207f92899fc72b00002df300000000',
          bitcoinMergedMiningMerkleProof:
            '0x21fa331c7d9811124888a5d1bfb2e467a3ccaa1be10e4c7d66b3bc6fc68bc6713b49f3e74dd624303216bc168bae245a2fd4cf888402c9232f304f0b2d886d0713b72faec89be16d77bf4a163ef3b5857aa3d68d38ceef9591c4870c01248da75aa0bb1f111737464477e99a67dfc78a48aa10fd6be13560aafcab1c250ab786eca35a6a4fb1a88bebad772eb811acc821c4efdd0d892380d2998aa02d0bdec1285210fcd8e678fdef110f1cc8b5a684031b864c1578f32c24db2aab07b686af16c00fc3676b0cc38ae6f3212883c4e5bc1dfd4395de35784e8bb552bf6f3844',
          hashForMergedMining:
            '0x48f014a065ac24175b1790e67f8f5f5b9713649107207f92899fc72b00002df3',
          paidFees: '0x0',
          cumulativeDifficulty: '0x3eeed982',
          received: 1702426066710,
        },
        {
          id: '1279bda6-3a19-4194-92a8-d2e5f4f8bcf2',
          number: 11762,
          hash: '0x95dcfeecb9b3d15de463fdcae2c3b84d05d0adfcd003039894e250bd2b333581',
          parentHash:
            '0xfd29f8966264085f3f5e4d618ea86d93caffc005a25c52f3cc76fbe67821f763',
          sha3Uncles:
            '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
          logsBloom:
            '0x00000008000000800000000000000000000000000000000000000000000008000000000000000000000000000000000050000000002000000000000000000000000000000000000000000000005000000010008000000000100000004000000000000000000200000000000000000000000080000000000000000000000000000000000000000200000800000000000000000001000000000000000400000000000000000000100000000000000010000000000000000002001000000000000001000001000000000000000000000000000020000000000080200000100000000000000000000000000000000000100000080000000000000000000000000000',
          transactionsRoot:
            '0x535c73fe66d965fa70c63f3a0f0a959d765460d872e778965ebb1e3e260a1f15',
          stateRoot:
            '0xfde4006c3cdec42ae156517ed8fdc67de7f9e1f2a4554c76c446c8fd0d064dba',
          receiptsRoot:
            '0x8611f89c2205ad5b2c41521e3644597d410adbd66f648a9a292cdde8d2ea3f9e',
          miner: '0x1fab9a0e24ffc209b01faa5a61ad4366982d0b7f',
          difficulty: '0x1ed7e540',
          totalDifficulty: '0xd59316a7600',
          extraData: '0x',
          size: 1064,
          gasLimit: 6800000,
          gasUsed: 0,
          timestamp: 1562717358,
          transactions:
            '["0x54ec9cecbecc70d6a1d99647cfa665b3f06cb3d527c2484a088d35e9c918dae1","0x02b2be56164b786c2d83f9123913382a2997c1d41a8af55256d38c5c839cfe45"]',
          uncles: '[]',
          minimumGasPrice: '0x0',
          bitcoinMergedMiningHeader:
            '0x0000002004457ab7952afda9818aa2b423ff0b6301b336c18376f00475020000000000007f593d03104147528e275cad4a9104fc95191a82bcecf2188e3ec3fda53fa88dba2c255d531d041a81600e3c',
          bitcoinMergedMiningCoinbaseTransaction:
            '0x00000000000000804f707a6ab429f0fda6dfbb667c6964808f2ffb86e6211a1b160d32a350500e436088ac0000000000000000266a24aa21a9edf4509c0b88729f017af8856280028f50b41c64f4a4b25a07b712a0e40db758d100000000000000002a6a52534b424c4f434b3a590770abeb5372f69b9bdf9baf22f9f042edc31907207f92899fc72d00002df200000000',
          bitcoinMergedMiningMerkleProof:
            '0x21fa331c7d9811124888a5d1bfb2e467a3ccaa1be10e4c7d66b3bc6fc68bc6713b49f3e74dd624303216bc168bae245a2fd4cf888402c9232f304f0b2d886d0713b72faec89be16d77bf4a163ef3b5857aa3d68d38ceef9591c4870c01248da71b09d0306992b44ba00986a23bdd7e99a3b2e92a59047cd5480f54350afb46fc440d45269c1f7fd3cb7a0ff8c5bc2e20ffb302ee02b2b6cede63c14d4d178be66525b7f7ee97120fde093e3888449a6b6355278420cb6452e59a2adbe8bd590b3cedbc0e574964c41504f47134927e6bd366bfea67391071cfca2dd8be57918b',
          hashForMergedMining:
            '0x590770abeb5372f69b9bdf9baf22f9f042edc31907207f92899fc72d00002df2',
          paidFees: '0x0',
          cumulativeDifficulty: '0x1ed7e540',
          received: 1702426065659,
        },
      ];

      const result = service.formatBlock(mockBlocks as any[]);

      // Expected results for formatted blocks
      expect(result).toEqual([
        {
          id: 'd04ae81d-0191-4311-9f7f-9ba3052ef4a8',
          number: 11763,
          hash: '0x0618cf5e6f68a2ae62261455222e39b598452e004daab6d67939c066ddf80a10',
          parentHash:
            '0x95dcfeecb9b3d15de463fdcae2c3b84d05d0adfcd003039894e250bd2b333581',
          sha3Uncles:
            '0xeceeb6d81804f8c0dd17c636be2888131fd327c6b7993a5e07a267790169b71f',
          logsBloom:
            '0x00000008000000800000000000000000000000000000000000000000000008000000000000040000000000000000000050000000000000000000000000000000000000000000000000000000005000000010000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000200000000000001040000000000000400000000000000000000100000000000000010000000000000000000001000000000000001000001000000000000000000000000000020000000000080200000100000000000000000000000000000000000000000000000000000000000000000000000',
          transactionsRoot:
            '0x231800faa975df539f3a3234d6ae5ec3308d1ecd9d7355e35efd314952f98e66',
          stateRoot:
            '0x0b0396e04adf8168852aca3b978318ccfe11210317c24b6dc094feca4c627284',
          receiptsRoot:
            '0x56840aee24a3bf7b78fa2feaa8f953377dad862795365ea30b4c581df5d476cf',
          miner: '0x1fab9a0e24ffc209b01faa5a61ad4366982d0b7f',
          difficulty: '0x1f75d03c',
          totalDifficulty: '0xd5970594f82',
          extraData: '0x',
          size: 1889,
          gasLimit: 6800000,
          gasUsed: 0,
          timestamp: '1562717375',
          transactions: 1,
          uncles: [
            '0x64c505d802d0b71d120856f7ac5fef1bffd6e22f438a0b1d4e08dd8f13702be1',
          ],
          minimumGasPrice: 0,
          bitcoinMergedMiningHeader:
            '0x0000002004457ab7952afda9818aa2b423ff0b6301b336c18376f0047502000000000000871c405d2415e3265e17dcdb9d8a338d9dd0d9dd2a70619eb3ba48d62f0cdeead82c255d531d041ac3b29344',
          bitcoinMergedMiningCoinbaseTransaction:
            '0x0000000000000080860921cb2564bb9567db247922d4733f7d54079881f8671a20c8061d281d25706088ac0000000000000000266a24aa21a9ed0c697599f6886da0e902370163a0aa00e5999ec3d78da2f770b5a5bcf0a912f800000000000000002a6a52534b424c4f434b3a48f014a065ac24175b1790e67f8f5f5b9713649107207f92899fc72b00002df300000000',
          bitcoinMergedMiningMerkleProof:
            '0x21fa331c7d9811124888a5d1bfb2e467a3ccaa1be10e4c7d66b3bc6fc68bc6713b49f3e74dd624303216bc168bae245a2fd4cf888402c9232f304f0b2d886d0713b72faec89be16d77bf4a163ef3b5857aa3d68d38ceef9591c4870c01248da75aa0bb1f111737464477e99a67dfc78a48aa10fd6be13560aafcab1c250ab786eca35a6a4fb1a88bebad772eb811acc821c4efdd0d892380d2998aa02d0bdec1285210fcd8e678fdef110f1cc8b5a684031b864c1578f32c24db2aab07b686af16c00fc3676b0cc38ae6f3212883c4e5bc1dfd4395de35784e8bb552bf6f3844',
          hashForMergedMining:
            '0x48f014a065ac24175b1790e67f8f5f5b9713649107207f92899fc72b00002df3',
          paidFees: '0x0',
          cumulativeDifficulty: '0x3eeed982',
          difficultyInGH: 0.527814716,
          totalDifficultyInEH: 0.000014677788151682,
          blockHashrateInMHs: 31.047924470588235,
          txDensity: 0.058823529411764705,
          time: '0m 17s',
        },
      ]);
    });

    it('should handle an empty array of blocks', () => {
      const result = service.formatBlock([]);
      expect(result).toEqual([]);
    });
  });
});
