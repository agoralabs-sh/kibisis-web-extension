import { Account, generateAccount, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';

// config
import { networks } from '@extension/config';

// contracts
import ARC0200Contract from './ARC0200Contract';

// types
import type { IBaseOptions } from '@common/types';
import type { IARC0200AssetInformation, INetwork } from '@extension/types';

// utils
import createLogger from '@common/utils/createLogger';

describe.skip(`${__dirname}#ARC0200Contract`, () => {
  const appId: BigNumber = new BigNumber('6779767');
  const decimals: BigNumber = new BigNumber('6');
  const name: string = 'Voi Incentive Asset';
  const options: IBaseOptions = {
    logger: createLogger('debug'),
  };
  const symbol: string = 'VIA';
  const totalSupply: BigNumber = new BigNumber('10000000000000000');
  let contract: ARC0200Contract;

  beforeAll(() => {
    const network: INetwork | null =
      networks.find((value) => value.genesisId === 'voitest-v1') || null;

    if (!network) {
      throw new Error('unable to find voi testnet network');
    }

    contract = new ARC0200Contract({
      appId,
      network,
      ...options,
    });
  });

  describe('when getting the balanceOf', () => {
    it('should return 0 for a new account', async () => {
      // arrange
      const account: Account = generateAccount();
      // act
      const result: BigNumber = await contract.balanceOf(account.addr);

      // assert
      expect(result.toNumber()).toBe(0);
    });
  });

  describe('when getting the decimals', () => {
    it('should return the decimals', async () => {
      // arrange
      // act
      const result: BigNumber = await contract.decimals();

      // assert
      expect(result.eq(decimals)).toBe(true);
    });
  });

  describe('when getting the name', () => {
    it('should return the name', async () => {
      // arrange
      // act
      const result: string = await contract.name();

      // assert
      expect(result).toBe(name);
    });
  });

  describe('when getting the metadata', () => {
    it('should return the metadata', async () => {
      // arrange
      // act
      const result: IARC0200AssetInformation = await contract.metadata();

      // assert
      expect(result.decimals).toBe(BigInt(String(decimals.toString())));
      expect(result.name).toBe(name);
      expect(result.symbol).toBe(symbol);
      expect(result.totalSupply).toBe(BigInt(String(totalSupply.toString())));
    });
  });

  describe('when getting the symbol', () => {
    it('should return the symbol', async () => {
      // arrange
      // act
      const result: string = await contract.symbol();

      // assert
      expect(result).toBe(symbol);
    });
  });

  describe('when creating transfer transactions', () => {
    it('should create a payment transaction as well as an application write transaction', async () => {
      // arrange
      const account: Account = generateAccount();
      // act
      const transactions: Transaction[] =
        await contract.buildUnsignedTransferTransactions({
          amountInAtomicUnits: new BigNumber('1'),
          fromAddress:
            'KREOFZLBZNCFTBNY4NQQMYZHPZLCCHR66FKZ3DQPXY6BIXXL4YIS232YAU',
          toAddress: account.addr,
        });

      // assert
      expect(transactions.length).toBe(2);
    });

    it('should only create an application write transaction', async () => {
      // arrange
      const account: Account = generateAccount();
      // act
      const transactions: Transaction[] =
        await contract.buildUnsignedTransferTransactions({
          amountInAtomicUnits: new BigNumber('1'),
          fromAddress:
            'KREOFZLBZNCFTBNY4NQQMYZHPZLCCHR66FKZ3DQPXY6BIXXL4YIS232YAU',
          toAddress: account.addr,
        });

      // assert
      expect(transactions.length).toBe(1);
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
