import BigNumber from 'bignumber.js';

// config
import { networks } from '@extension/config';

// contracts
import ARC0200Contract from './ARC0200Contract';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// errors
import { ARC0200NotAValidApplicationError } from '@extension/errors';

// types
import type { IBaseOptions } from '@common/types';
import type { IARC0200AssetInformation, INetwork } from '@extension/types';

// utils
import createLogger from '@common/utils/createLogger';

describe(`${__dirname}#ARC0200Contract`, () => {
  const appId: BigNumber = new BigNumber('6779767');
  const options: IBaseOptions = {
    logger: createLogger('debug'),
  };
  let contract: ARC0200Contract;

  beforeAll(() => {
    const network: INetwork | null =
      networks.find((value) => value.genesisId === 'voitest-v1') || null;

    if (!network) {
      throw new Error('unable to find voi testnet network');
    }

    contract = new ARC0200Contract({
      network,
      ...options,
    });
  });

  describe('when getting the decimals', () => {
    it('should return the decimals', async () => {
      // arrange
      // act
      const result: BigNumber = await contract.decimals(appId);

      // assert
      expect(result.toNumber()).toBe(6);
    });
  });

  describe('when getting the name', () => {
    it('should return the name', async () => {
      // arrange
      // act
      const result: string = await contract.name(appId);

      // assert
      expect(result).toBe('Voi Incentive Asset');
    });
  });

  describe('when getting the symbol', () => {
    it('should return the symbol', async () => {
      // arrange
      // act
      const result: string = await contract.symbol(appId);

      // assert
      expect(result).toBe('VIA');
    });
  });

  describe('when getting the total supply', () => {
    it('should return the total supply', async () => {
      // arrange
      // act
      const result: BigNumber = await contract.totalSupply(appId);

      // assert
      expect(result.toString()).toBe('10000000000000000');
    });
  });
});
