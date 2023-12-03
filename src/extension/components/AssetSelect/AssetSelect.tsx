import React, { FC } from 'react';
import Select, { GroupBase, OptionProps, SingleValueProps } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

// components
import AssetSelectOption from './AssetSelectOption';
import AssetSelectSingleValue from './AssetSelectSingleValue';

// constants
import { OPTION_HEIGHT } from './constants';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAccountInformation,
  IAsset,
  INetworkWithTransactionParams,
} from '@extension/types';
import { IOption } from './types';

// utils
import {
  convertGenesisHashToHex,
  createNativeCurrencyAsset,
} from '@extension/utils';

interface IProps {
  account: IAccount;
  assets: IAsset[];
  includeNativeCurrency?: boolean;
  network: INetworkWithTransactionParams;
  onAssetChange: (value: IAsset) => void;
  value: IAsset;
  width?: string | number;
}

const AssetSelect: FC<IProps> = ({
  account,
  assets,
  includeNativeCurrency = false,
  network,
  onAssetChange,
  value,
  width,
}: IProps) => {
  // hooks
  const borderColor: string = useColorModeValue(
    theme.colors.gray['200'],
    theme.colors.whiteAlpha['400']
  );
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const primaryColor25: string = useColorModeValue(
    theme.colors.primaryLight['200'],
    theme.colors.primaryDark['200']
  );
  const primaryColor50: string = useColorModeValue(
    theme.colors.primaryLight['300'],
    theme.colors.primaryDark['300']
  );
  const primaryColor75: string = useColorModeValue(
    theme.colors.primaryLight['400'],
    theme.colors.primaryDark['400']
  );
  // misc
  const accountInformation: IAccountInformation | null =
    account.networkInformation[
      convertGenesisHashToHex(network.genesisHash).toUpperCase()
    ] || null;
  const selectableAssets: IAsset[] =
    accountInformation?.assetHoldings.reduce<IAsset[]>(
      (acc, assetHolding) => {
        const asset: IAsset | null =
          assets.find((value) => value.id === assetHolding.id) || null;

        if (!asset) {
          return acc;
        }

        return [...acc, asset];
      },
      includeNativeCurrency ? [createNativeCurrencyAsset(network)] : []
    ) || [];
  // handlers
  const handleAssetChange = (value: IOption) => onAssetChange(value.asset);
  const handleSearchFilter = (
    { data }: FilterOptionOption<IOption>,
    inputValue: string
  ) => {
    return !!(
      data.asset.id.toUpperCase().includes(inputValue.toUpperCase()) ||
      (data.asset.unitName &&
        data.asset.unitName.toUpperCase().includes(inputValue.toUpperCase()))
    );
  };

  return (
    <Select
      components={{
        Option: ({
          data,
          innerProps,
          isSelected,
        }: OptionProps<IOption, false, GroupBase<IOption>>) => (
          <AssetSelectOption
            asset={data.asset}
            isSelected={isSelected}
            onClick={innerProps.onClick}
            network={network}
          />
        ),
        SingleValue: ({
          data,
        }: SingleValueProps<IOption, false, GroupBase<IOption>>) => (
          <AssetSelectSingleValue asset={data.asset} network={network} />
        ),
      }}
      filterOption={handleSearchFilter}
      onChange={handleAssetChange}
      options={selectableAssets.map<IOption>((value) => ({
        asset: value,
        value: value.id,
      }))}
      styles={{
        container: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
          height: OPTION_HEIGHT,
          width: width || '100%',
        }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
          height: '100%',
        }),
        indicatorSeparator: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: borderColor,
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
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
        asset: value,
        value: value.id,
      }}
    />
  );
};

export default AssetSelect;
