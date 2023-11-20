import BigNumber from 'bignumber.js';

// utils
import convertToAtomicUnit from './convertToAtomicUnit';

interface ITestParams {
  expected: BigNumber;
  standardUnit: BigNumber;
}

describe('convertToAtomicUnit()', () => {
  describe('when converting units with a lot of decimals', () => {
    it.each([
      {
        standardUnit: new BigNumber('0.00000000000001'),
        expected: new BigNumber('10000'),
      },
      {
        standardUnit: new BigNumber('1.000000000000001'),
        expected: new BigNumber('1000000000000001000'),
      },
      {
        standardUnit: new BigNumber('3.2'),
        expected: new BigNumber('3200000000000000000'),
      },
      {
        standardUnit: new BigNumber('3.200000000000000001'),
        expected: new BigNumber('3200000000000000001'),
      },
    ])(
      `should convert the standard unit of "$standardUnit" to it's atomic unit of $expected`,
      ({ expected, standardUnit }: ITestParams) => {
        expect(convertToAtomicUnit(standardUnit, 18).comparedTo(expected)).toBe(
          0
        );
      }
    );
  });

  describe('when converting units with no decimals', () => {
    it.each([
      { standardUnit: new BigNumber('1000'), expected: new BigNumber('1000') },
      { standardUnit: new BigNumber('230'), expected: new BigNumber('230') },
      {
        standardUnit: new BigNumber('187281'),
        expected: new BigNumber('187281'),
      },
    ])(
      `should convert the standard unit of "$standardUnit" to it's atomic unit of $expected`,
      ({ expected, standardUnit }: ITestParams) => {
        expect(convertToAtomicUnit(standardUnit, 0).comparedTo(expected)).toBe(
          0
        );
      }
    );
  });

  describe('when converting units with decimals of moderate size', () => {
    it.each([
      {
        standardUnit: new BigNumber('1000'),
        expected: new BigNumber('100000'),
      },
      { standardUnit: new BigNumber('0.01'), expected: new BigNumber('1') },
      { standardUnit: new BigNumber('0.1'), expected: new BigNumber('10') },
      { standardUnit: new BigNumber('2.3'), expected: new BigNumber('230') },
      { standardUnit: new BigNumber('24.57'), expected: new BigNumber('2457') },
      {
        standardUnit: new BigNumber('9999.99'),
        expected: new BigNumber('999999'),
      },
      {
        standardUnit: new BigNumber('9999.9'),
        expected: new BigNumber('999990'),
      },
      {
        standardUnit: new BigNumber('3.456984736'),
        expected: new BigNumber('345.6984736'),
      },
    ])(
      `should convert the standard unit of "$standardUnit" to it's atomic unit of $expected`,
      ({ expected, standardUnit }: ITestParams) => {
        expect(convertToAtomicUnit(standardUnit, 2).comparedTo(expected)).toBe(
          0
        );
      }
    );
  });
});
