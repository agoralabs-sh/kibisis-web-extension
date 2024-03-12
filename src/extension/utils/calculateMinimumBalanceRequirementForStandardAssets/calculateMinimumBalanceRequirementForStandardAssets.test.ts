import { Account, decodeAddress, generateAccount } from 'algosdk';
import BigNumber from 'bignumber.js';

// config
import { networks } from '@extension/config';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccount, INetworkWithTransactionParams } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import calculateMinimumBalanceRequirementForStandardAssets from './calculateMinimumBalanceRequirementForStandardAssets';
import { MINIMUM_BALANCE_REQUIREMENT } from '../../constants';

interface ITestParams {
  expected: BigNumber;
  minBalanceInAtomicUnits: BigNumber;
  numOfStandardAssets?: number;
}

describe(`${__dirname}/calculateMinimumBalanceRequirementForStandardAssets`, () => {
  let account: IAccount;
  let encodedGenesisHash: string;
  let network: INetworkWithTransactionParams;

  beforeAll(() => {
    const _account: Account = generateAccount();

    account = AccountService.initializeDefaultAccount({
      publicKey: AccountService.encodePublicKey(
        decodeAddress(_account.addr).publicKey
      ),
    });
    network = {
      ...networks[0],
      fee: '1000',
      minFee: '1000',
      updatedAt: new Date().getTime(),
    };
    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
  });

  it.each([
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(2),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      numOfStandardAssets: 1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(3),
      minBalanceInAtomicUnits: new BigNumber(
        MINIMUM_BALANCE_REQUIREMENT
      ).multipliedBy(2),
      numOfStandardAssets: 1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      numOfStandardAssets: -1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(2),
      minBalanceInAtomicUnits: new BigNumber(
        MINIMUM_BALANCE_REQUIREMENT
      ).multipliedBy(3),
      numOfStandardAssets: -1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      minBalanceInAtomicUnits: new BigNumber(
        MINIMUM_BALANCE_REQUIREMENT
      ).multipliedBy(3),
      numOfStandardAssets: -3,
    },
  ])(
    `should get the minimum balance $expected for the number of standard assets "$numOfStandardAssets"`,
    ({
      expected,
      minBalanceInAtomicUnits,
      numOfStandardAssets,
    }: ITestParams) => {
      account.networkInformation[encodedGenesisHash] = {
        ...account.networkInformation[encodedGenesisHash],
        minAtomicBalance: minBalanceInAtomicUnits.toString(),
      };

      expect(
        calculateMinimumBalanceRequirementForStandardAssets({
          account,
          network,
          numOfStandardAssets,
        }).comparedTo(expected)
      ).toBe(0);
    }
  );
});
