// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type { IApplicationTransaction } from '@extension/types';

// utils
import parseARC0200Transaction from '@extension/utils/parseARC0200Transaction/parseARC0200Transaction';

describe(`${__dirname}/parseARC0200Transaction`, () => {
  it('should parse a transfer transaction', () => {
    // arrange
    const transaction: IApplicationTransaction = {
      completedAt: 1707654106000,
      fee: '1000',
      id: 'JSWYMGXCGMDUT45HWMHAXFM4364Q3HW2IDWMDK66A3LHAGIHQZEQ',
      genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
      groupId: 'qo2ZGx7+TD0PYNCv4/cEHgIRLJ6/PPyyFh3gUlRbSxc=',
      note: null,
      rekeyTo: null,
      sender: 'TESTKHUQJXXNSDSTCIY35GL3XMLFWNFEYH3HNATVGBURZR7XJP7C6EYM6Y',
      applicationArgs: [
        '2nAluQ==',
        '/lQYyllCU47Y9EwCWeYXlt0q7qrVAd9Blf8UrtgExbI=',
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ=',
      ],
      applicationId: '6779767',
      accounts: [],
      approvalProgram: null,
      clearStateProgram: null,
      extraProgramPages: null,
      foreignApps: [],
      foreignAssets: [],
      innerTransactions: null,
      type: TransactionTypeEnum.ApplicationNoOp,
    };
    // act
    const result = parseARC0200Transaction(transaction);

    // assert
    if (!result) {
      throw new Error('unable to parse transaction');
    }

    expect(result.type).toBe(TransactionTypeEnum.ARC0200AssetTransfer);
  });
});
