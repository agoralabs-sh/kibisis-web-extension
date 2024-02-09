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

  describe('when getting the name', () => {
    it('should return the name', async () => {
      // arrange
      // act
      const result: string = await contract.name(new BigNumber('6779767'));

      // assert
      expect(result).toBe('Voi Incentive Asset');
    });
  });

  describe('when getting the symbol', () => {
    it.only('should return the symbol', async () => {
      // arrange
      // act
      const result: string = await contract.symbol(new BigNumber('6779767'));

      // assert
      expect(result).toBe('VIA');
    });
  });
});
