import BigNumber from 'bignumber.js';

// Utils
import convertToStandardUnit from './convertToStandardUnit';

interface ITestParams {
  atomicUnit: BigNumber;
  expected: BigNumber;
}

describe('convertToStandardUnit()', () => {
  describe('when converting units with a lot of decimals', () => {
    it.each([
      {
        atomicUnit: new BigNumber('10000'),
        expected: new BigNumber('0.00000000000001'),
      },
      {
        atomicUnit: new BigNumber('1000000000000001000'),
        expected: new BigNumber('1.000000000000001'),
      },
      {
        atomicUnit: new BigNumber('3200000000000000000'),
        expected: new BigNumber('3.2'),
      },
      {
        atomicUnit: new BigNumber('3200000000000000001'),
        expected: new BigNumber('3.200000000000000001'),
      },
    ])(
      `should convert the standard unit of "$atomicUnit" to it's atomic unit of $expected`,
      ({ atomicUnit, expected }: ITestParams) => {
        expect(convertToStandardUnit(atomicUnit, 18).comparedTo(expected)).toBe(
          0
        );
      }
    );
  });

  describe('when converting units with no decimals', () => {
    it.each([
      { atomicUnit: new BigNumber('1000'), expected: new BigNumber('1000') },
      { atomicUnit: new BigNumber('230'), expected: new BigNumber('230') },
      {
        atomicUnit: new BigNumber('187281'),
        expected: new BigNumber('187281'),
      },
    ])(
      `should convert the standard unit of "$atomicUnit" to it's atomic unit of $expected`,
      ({ atomicUnit, expected }: ITestParams) => {
        expect(convertToStandardUnit(atomicUnit, 0).comparedTo(expected)).toBe(
          0
        );
      }
    );
  });

  describe('when converting units with a moderate amount of decimals', () => {
    it.each([
      { atomicUnit: new BigNumber('1000'), expected: new BigNumber('10.0') },
      { atomicUnit: new BigNumber('1'), expected: new BigNumber('0.01') },
      { atomicUnit: new BigNumber('10'), expected: new BigNumber('0.1') },
      { atomicUnit: new BigNumber('230'), expected: new BigNumber('2.3') },
      { atomicUnit: new BigNumber('2457'), expected: new BigNumber('24.57') },
      {
        atomicUnit: new BigNumber('999999'),
        expected: new BigNumber('9999.99'),
      },
      {
        atomicUnit: new BigNumber('999990'),
        expected: new BigNumber('9999.9'),
      },
      {
        atomicUnit: new BigNumber('345.6984736'),
        expected: new BigNumber('3.456984736'),
      },
    ])(
      `should convert the standard unit of "$atomicUnit" to it's atomic unit of $expected`,
      ({ atomicUnit, expected }: ITestParams) => {
        expect(convertToStandardUnit(atomicUnit, 2).comparedTo(expected)).toBe(
          0
        );
      }
    );
  });
});
