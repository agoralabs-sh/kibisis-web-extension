import React, { FC } from 'react';
import Select, { GroupBase, OptionProps, SingleValueProps } from 'react-select';
import type { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

// components
import AccountSelectOption from './AccountSelectOption';
import AccountSelectSingleValue from './AccountSelectSingleValue';

// constants
import { BODY_BACKGROUND_COLOR, OPTION_HEIGHT } from '@extension/constants';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// theme
import { theme } from '@extension/theme';

// types
import type { IOption, IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const AccountSelect: FC<IProps> = ({
  accounts,
  disabled = false,
  onSelect,
  value,
  width,
}) => {
  // hooks
  const primaryColor = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const primaryColor25 = useColorModeValue(
    theme.colors.primaryLight['200'],
    theme.colors.primaryDark['200']
  );
  const primaryColor50 = useColorModeValue(
    theme.colors.primaryLight['300'],
    theme.colors.primaryDark['300']
  );
  const primaryColor75 = useColorModeValue(
    theme.colors.primaryLight['400'],
    theme.colors.primaryDark['400']
  );
  // handlers
  const handleAccountChange = (option: IOption) => onSelect(option.value);
  const handleSearchFilter = (
    { data }: FilterOptionOption<IOption>,
    inputValue: string
  ) =>
    convertPublicKeyToAVMAddress(PrivateKeyService.decode(data.value.publicKey))
      .toUpperCase()
      .includes(inputValue) ||
    (!!data.value.name && data.value.name.toUpperCase().includes(inputValue));

  return (
    <Select
      components={{
        Option: ({
          data,
          innerProps,
          isSelected,
        }: OptionProps<IOption, false, GroupBase<IOption>>) => (
          <AccountSelectOption
            account={data.value}
            isSelected={isSelected}
            onClick={innerProps.onClick}
          />
        ),
        SingleValue: ({
          data,
        }: SingleValueProps<IOption, false, GroupBase<IOption>>) => (
          <AccountSelectSingleValue account={data.value} />
        ),
      }}
      isDisabled={disabled}
      filterOption={handleSearchFilter}
      onChange={handleAccountChange}
      options={accounts.map<IOption>((value) => ({
        value,
      }))}
      styles={{
        container: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: BODY_BACKGROUND_COLOR,
          height: OPTION_HEIGHT,
          width: width || '100%',
        }),
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: BODY_BACKGROUND_COLOR,
          cursor: 'pointer',
          height: '100%',
        }),
        indicatorSeparator: (baseStyles) => ({
          ...baseStyles,
          display: 'none',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: BODY_BACKGROUND_COLOR,
        }),
      }}
      theme={(value) => ({
        ...value,
        colors: {
          ...theme.colors,
          primary: primaryColor,
          primary25: primaryColor25,
          primary50: primaryColor50,
          primary75: primaryColor75,
        },
      })}
      value={{
        value,
      }}
    />
  );
};

export default AccountSelect;
