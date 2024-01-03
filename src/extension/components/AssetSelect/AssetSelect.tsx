import React, { FC } from 'react';
import Select, { GroupBase, OptionProps, SingleValueProps } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

// components
import AssetSelectArc200AssetOption from './AssetSelectArc200AssetOption';
import AssetSelectArc200AssetSingleValue from './AssetSelectArc200AssetSingleValue';
import AssetSelectNativeCurrencyOption from './AssetSelectNativeCurrencyOption';
import AssetSelectNativeCurrencySingleValue from './AssetSelectNativeCurrencySingleValue';
import AssetSelectStandardAssetOption from './AssetSelectStandardAssetOption';
import AssetSelectStandardAssetSingleValue from './AssetSelectStandardAssetSingleValue';

// constants
import { BODY_BACKGROUND_COLOR } from '@extension/constants';
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
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';
import { IOption } from './types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

interface IProps {
  account: IAccount;
  assets: (IAssetTypes | INativeCurrency)[];
  network: INetworkWithTransactionParams;
  onAssetChange: (value: IAssetTypes | INativeCurrency) => void;
  value: IAssetTypes | INativeCurrency;
  width?: string | number;
}

const AssetSelect: FC<IProps> = ({
  account,
  assets,
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
  const selectableAssets: (IAssetTypes | INativeCurrency)[] = assets.reduce<
    (IAssetTypes | INativeCurrency)[]
  >((acc, asset) => {
    let selectedAsset: IAssetTypes | INativeCurrency | null;

    switch (asset.type) {
      // check if the asset exists in the asset holdings of the account; has it been "added"
      case AssetTypeEnum.Arc200:
        selectedAsset = accountInformation?.arc200AssetHoldings.find(
          (value) => value.id === asset.id
        )
          ? asset
          : null;
        break;
      // native currency always exist
      case AssetTypeEnum.Native:
        selectedAsset = asset;
        break;
      // check if the asset exists in the standard asset holdings of the account; has it been opted-in
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
  }, []);
  // handlers
  const handleAssetChange = (option: IOption) => onAssetChange(option.value);
  const handleSearchFilter = (
    { data }: FilterOptionOption<IOption>,
    inputValue: string
  ) => {
    switch (data.value.type) {
      case AssetTypeEnum.Arc200:
        return (
          data.value.id.toUpperCase().includes(inputValue.toUpperCase()) ||
          data.value.symbol.toUpperCase().includes(inputValue.toUpperCase())
        );
      case AssetTypeEnum.Native:
        return data.value.symbol
          .toUpperCase()
          .includes(inputValue.toUpperCase());
      case AssetTypeEnum.Standard:
        return !!(
          data.value.id.toUpperCase().includes(inputValue.toUpperCase()) ||
          (data.value.unitName &&
            data.value.unitName
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
          switch (data.value.type) {
            case AssetTypeEnum.Arc200:
              return (
                <AssetSelectArc200AssetOption
                  asset={data.value}
                  isSelected={isSelected}
                  onClick={innerProps.onClick}
                  network={network}
                />
              );
            case AssetTypeEnum.Native:
              return (
                <AssetSelectNativeCurrencyOption
                  asset={data.value}
                  isSelected={isSelected}
                  onClick={innerProps.onClick}
                />
              );
            case AssetTypeEnum.Standard:
              return (
                <AssetSelectStandardAssetOption
                  asset={data.value}
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
          switch (data.value.type) {
            case AssetTypeEnum.Arc200:
              return (
                <AssetSelectArc200AssetSingleValue
                  asset={data.value}
                  network={network}
                />
              );
            case AssetTypeEnum.Native:
              return (
                <AssetSelectNativeCurrencySingleValue asset={data.value} />
              );
            case AssetTypeEnum.Standard:
              return (
                <AssetSelectStandardAssetSingleValue
                  asset={data.value}
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
        value,
      }))}
      styles={{
        container: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: BODY_BACKGROUND_COLOR,
          height: OPTION_HEIGHT,
          width: width || '100%',
        }),
        control: (baseStyles, state) => ({
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

export default AssetSelect;
