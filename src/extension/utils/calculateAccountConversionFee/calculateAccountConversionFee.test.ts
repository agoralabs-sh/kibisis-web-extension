import BigNumber from 'bignumber.js';

// types
import type { ITransactionParams } from '@extension/types';

// utils
import calculateAccountConversionFee from './calculateAccountConversionFee';

interface ITestParams {
  expected: BigNumber;
  numOfARC0200Assets: number;
  numOfStandardAssets: number;
}

describe('calculateAccountConversionFee()', () => {
  const boxStorageFee: BigNumber = new BigNumber('256000');
  const transactionParams: ITransactionParams = {
    fee: '1000',
    minFee: '1000',
    updatedAt: new Date().getTime(),
  };

  it.each([
    {
      expected: new BigNumber('110000'),
      numOfARC0200Assets: 0,
      numOfStandardAssets: 0,
    },
  ])(
    `should return $expected when there are $numOfARC0200Assets and there are $numOfStandardAssets`,
    ({ expected, numOfARC0200Assets, numOfStandardAssets }: ITestParams) => {
      // arrange
      // act
      const result: BigNumber = calculateAccountConversionFee({
        boxStorageFee,
        numOfARC0200Assets,
        numOfStandardAssets,
        transactionParams,
      });

      console.log(result.toString());

      // assert
      expect(result.eq(expected)).toBe(true);
    }
  );
});
