import { Account, generateAccount } from 'algosdk';
import BigNumber from 'bignumber.js';

// config
import { networks } from '@extension/config';

// contracts
import ARC0072Contract from './ARC0072Contract';

// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

// utils
import createLogger from '@common/utils/createLogger';

describe.skip(`${__dirname}#ARC0072Contract`, () => {
  const appId = '28385598';
  const options: IBaseOptions = {
    logger: createLogger('debug'),
  };
  const totalSupply: BigNumber = new BigNumber('14');
  let contract: ARC0072Contract;

  beforeAll(() => {
    const network: INetwork | null =
      networks.find((value) => value.genesisId === 'voitest-v1') || null;

    if (!network) {
      throw new Error('unable to find voi testnet network');
    }

    contract = new ARC0072Contract({
      appId,
      network,
      ...options,
    });
  });

  describe('when getting the balance for an owner', () => {
    it('should return 0 for a new account', async () => {
      // arrange
      const account: Account = generateAccount();
      // act
      const result: BigNumber = await contract.balanceOf(account.addr);

      // assert
      expect(result.toNumber()).toBe(0);
    });
  });

  describe('when getting the owner of a token', () => {
    it('should return null for a token that does not exist', async () => {
      // arrange
      // act
      const result: string | null = await contract.ownerOf(
        new BigNumber('9999999')
      );

      // assert
      expect(result).toBeNull();
    });
  });

  describe('when getting the token URI', () => {
    it('should return 0 for a new account', async () => {
      // arrange
      // act
      const result: string = await contract.tokenURI(new BigNumber('100'));

      // assert
      expect(result).toBe('');
    });
  });

  describe('when getting the total supply', () => {
    it('should return the total supply', async () => {
      // arrange
      // act
      const result: BigNumber = await contract.totalSupply();

      // assert
      expect(result.eq(totalSupply)).toBe(true);
    });
  });
});
