import React, { FC } from 'react';
import Select, { GroupBase, OptionProps, SingleValueProps } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

// components
import AssetSelectArc200AssetOption from './AssetSelectArc200AssetOption';
import AssetSelectArc200AssetSingleValue from './AssetSelectArc200AssetSingleValue';
import AssetSelectStandardAssetOption from './AssetSelectStandardAssetOption';
import AssetSelectStandardAssetSingleValue from './AssetSelectStandardAssetSingleValue';

// constants
import { OPTION_HEIGHT } from './constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAccountInformation,
  IStandardAsset,
  INetworkWithTransactionParams,
  IArc200Asset,
} from '@extension/types';
import { IOption } from './types';

// utils
import {
  convertGenesisHashToHex,
  createNativeCurrencyAsset,
} from '@extension/utils';

interface IProps {
  account: IAccount;
  assets: (IArc200Asset | IStandardAsset)[];
  includeNativeCurrency?: boolean;
  network: INetworkWithTransactionParams;
  onAssetChange: (value: IArc200Asset | IStandardAsset) => void;
  value: IArc200Asset | IStandardAsset;
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
  const selectableAssets: (IArc200Asset | IStandardAsset)[] =
    assets.reduce<(IArc200Asset | IStandardAsset)[]>(
      (acc, asset) => {
        let selectedAsset: IArc200Asset | IStandardAsset | null;

        // check if the asset exists in the asset holdings of the account; has it been "added"
        switch (asset.type) {
          case AssetTypeEnum.Arc200:
            selectedAsset = accountInformation?.arc200AssetHoldings.find(
              (value) => value.id === asset.id
            )
              ? asset
              : null;
            break;
          case AssetTypeEnum.Standard:
            selectedAsset = accountInformation?.standardAssetHoldings.find(
              (value) => value.id === asset.id
            )
              ? asset
              : null;
            break;
          default:
            selectedAsset = null;
        }

        if (!selectedAsset) {
          return acc;
        }

        return [...acc, selectedAsset];
      },
      includeNativeCurrency ? [createNativeCurrencyAsset(network)] : []
    ) || [];
  // handlers
  const handleAssetChange = (value: IOption) => onAssetChange(value.asset);
  const handleSearchFilter = (
    { data }: FilterOptionOption<IOption>,
    inputValue: string
  ) => {
    switch (data.asset.type) {
      case AssetTypeEnum.Arc200:
        return (
          data.asset.id.toUpperCase().includes(inputValue.toUpperCase()) ||
          data.asset.symbol.toUpperCase().includes(inputValue.toUpperCase())
        );
      case AssetTypeEnum.Standard:
        return !!(
          data.asset.id.toUpperCase().includes(inputValue.toUpperCase()) ||
          (data.asset.unitName &&
            data.asset.unitName
              .toUpperCase()
              .includes(inputValue.toUpperCase()))
        );
      default:
        return false;
    }
  };

  return (
    <Select
      components={{
        Option: ({
          data,
          innerProps,
          isSelected,
        }: OptionProps<IOption, false, GroupBase<IOption>>) => {
          switch (data.asset.type) {
            case AssetTypeEnum.Arc200:
              return (
                <AssetSelectArc200AssetOption
                  asset={data.asset}
                  isSelected={isSelected}
                  onClick={innerProps.onClick}
                  network={network}
                />
              );
            case AssetTypeEnum.Standard:
              return (
                <AssetSelectStandardAssetOption
                  asset={data.asset}
                  isSelected={isSelected}
                  onClick={innerProps.onClick}
                  network={network}
                />
              );
            default:
              return null;
          }
        },
        SingleValue: ({
          data,
        }: SingleValueProps<IOption, false, GroupBase<IOption>>) => {
          switch (data.asset.type) {
            case AssetTypeEnum.Arc200:
              return (
                <AssetSelectArc200AssetSingleValue
                  asset={data.asset}
                  network={network}
                />
              );
            case AssetTypeEnum.Standard:
              return (
                <AssetSelectStandardAssetSingleValue
                  asset={data.asset}
                  network={network}
                />
              );
            default:
              return null;
          }
        },
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
          cursor: 'pointer',
          height: '100%',
        }),
        indicatorSeparator: (baseStyles) => ({
          ...baseStyles,
          display: 'none',
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
