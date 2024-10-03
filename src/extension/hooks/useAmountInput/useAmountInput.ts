import BigNumber from 'bignumber.js';
import numbro from 'numbro';
import { type FocusEvent, useState } from 'react';

// types
import type { IOnEventOptions } from '@extension/components/AmountInput';
import type { IOptions, IState } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';

export default function useAmountInput({ label, required }: IOptions): IState {
  // state
  const [value, setValue] = useState<string>('0');
  // actions
  const _onBlur =
    ({ asset, maximumAmountInAtomicUnits }: IOnEventOptions) =>
    (event: FocusEvent<HTMLInputElement>) => {
      let _value: BigNumber;
      let maximumAmountInStandardUnits: BigNumber;

      if (!asset || !maximumAmountInAtomicUnits) {
        setValue('0');

        return;
      }

      _value = new BigNumber(
        event.target.value.length > 0 ? event.target.value : '0'
      );
      maximumAmountInStandardUnits = convertToStandardUnit(
        new BigNumber(maximumAmountInAtomicUnits),
        asset.decimals
      );

      // if the entered value is greater than the maximum allowed, use the max
      if (_value.gt(maximumAmountInStandardUnits)) {
        setValue(_value.toFixed());

        return;
      }

      // format the number to use an absolute value (no negatives), the maximum decimals for the asset and trim any zeroes
      setValue(
        numbro(_value.absoluteValue().toString()).format({
          mantissa: asset.decimals,
          trimMantissa: true,
        })
      );
    };
  const _onChange = (valueAsString: string) => setValue(valueAsString);
  const _onFocus = (event: FocusEvent<HTMLInputElement>) => {
    // remove the padded zero
    if (event.target.value === '0') {
      setValue('');
    }
  };
  const _onMaximumAmountClick = ({
    asset,
    maximumAmountInAtomicUnits,
  }: IOnEventOptions) => {
    if (!asset || !maximumAmountInAtomicUnits) {
      return;
    }

    setValue(
      convertToStandardUnit(
        new BigNumber(maximumAmountInAtomicUnits),
        asset.decimals
      ).toString()
    );
  };
  const reset = () => {
    setValue('0');
  };

  return {
    label,
    onBlur: _onBlur,
    onChange: _onChange,
    onFocus: _onFocus,
    onMaximumAmountClick: _onMaximumAmountClick,
    reset,
    required,
    setValue,
    value,
  };
}
