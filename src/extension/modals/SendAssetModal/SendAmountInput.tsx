import {
  Button,
  HStack,
  Icon,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import numbro from 'numbro';
import React, { FC, FocusEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

interface IProps {
  account: IAccount;
  network: INetworkWithTransactionParams;
  maximumTransactionAmount: string;
  onValueChange: (value: string) => void;
  selectedAsset: IAssetTypes | INativeCurrency;
  value: string | null;
}

const SendAmountInput: FC<IProps> = ({
  account,
  network,
  maximumTransactionAmount,
  onValueChange,
  selectedAsset,
  value,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  // misc
  const balance: BigNumber = new BigNumber(
    account.networkInformation[
      convertGenesisHashToHex(network.genesisHash).toUpperCase()
    ]?.atomicBalance || 0
  );
  const assetDecimals: number = selectedAsset.decimals;
  const minBalance: BigNumber = new BigNumber(
    account.networkInformation[
      convertGenesisHashToHex(network.genesisHash).toUpperCase()
    ]?.minAtomicBalance || 0
  );
  const maximumTransactionAmountInStandardUnit: BigNumber =
    convertToStandardUnit(
      new BigNumber(maximumTransactionAmount),
      assetDecimals
    );
  // handlers
  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    const blurValue: BigNumber = new BigNumber(event.target.value || '0');

    // if the entered value is greater than the maximum allowed, use the max
    if (blurValue.gt(maximumTransactionAmountInStandardUnit)) {
      onValueChange(maximumTransactionAmountInStandardUnit.toString());

      return;
    }

    // format the number to use an absolute value (no negatives), the maximum decimals for the asset and trim any zeroes
    onValueChange(
      numbro(blurValue.absoluteValue().toString()).format({
        mantissa: assetDecimals,
        trimMantissa: true,
      })
    );
  };
  const handleOnChange = (valueAsString: string | undefined) =>
    onValueChange(valueAsString || '');
  const handleOnFocus = (event: FocusEvent<HTMLInputElement>) => {
    // remove the padded zero
    if (event.target.value === '0') {
      onValueChange('');
    }
  };
  const handleMaximumAmountClick = () =>
    onValueChange(maximumTransactionAmountInStandardUnit.toString());
  // renders
  const renderMaximumTransactionAmountLabel = () => {
    let symbol: string = '';
    let maximumTransactionAmountLabel: ReactElement;

    switch (selectedAsset.type) {
      case AssetTypeEnum.Arc200:
      case AssetTypeEnum.Native:
        symbol = selectedAsset.symbol;
        break;
      case AssetTypeEnum.Standard:
        symbol = selectedAsset.unitName || '';
        break;
      default:
        break;
    }

    maximumTransactionAmountLabel = (
      <Tooltip
        aria-label="Full maximum amount"
        label={maximumTransactionAmountInStandardUnit.toString()}
      >
        <HStack
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={DEFAULT_GAP / 3}
          py={1}
          spacing={1}
        >
          <Text color={subTextColor} fontSize="xs" textAlign="right">
            {`${t<string>('labels.max')}: ${formatCurrencyUnit(
              maximumTransactionAmountInStandardUnit,
              { decimals: selectedAsset.decimals }
            )} ${symbol}`}
          </Text>
        </HStack>
      </Tooltip>
    );

    if (selectedAsset.type === AssetTypeEnum.Native) {
      return (
        <HStack alignItems="center" justifyContent="center" spacing={1}>
          <Tooltip
            aria-label="Maximum transaction amount"
            label={t<string>(
              'captions.maximumNativeCurrencyTransactionAmount',
              {
                balance: formatCurrencyUnit(
                  convertToStandardUnit(balance, selectedAsset.decimals),
                  { decimals: selectedAsset.decimals }
                ),
                minBalance: formatCurrencyUnit(
                  convertToStandardUnit(minBalance, selectedAsset.decimals),
                  { decimals: selectedAsset.decimals }
                ),
                minFee: formatCurrencyUnit(
                  convertToStandardUnit(
                    new BigNumber(network.minFee),
                    selectedAsset.decimals
                  ),
                  { decimals: selectedAsset.decimals }
                ),
                nativeCurrencyCode: selectedAsset.symbol,
              }
            )}
          >
            <span
              style={{
                height: '1em',
                lineHeight: '1em',
              }}
            >
              <Icon as={IoInformationCircleOutline} color={defaultTextColor} />
            </span>
          </Tooltip>

          {maximumTransactionAmountLabel}
        </HStack>
      );
    }

    return maximumTransactionAmountLabel;
  };

  return (
    <VStack w="full">
      <HStack justifyContent="space-between" w="full">
        {/*label*/}
        <Text color={defaultTextColor} fontSize="md" textAlign="left">
          {t<string>('labels.amount')}
        </Text>

        <Spacer />

        {/*maximum amount*/}
        {renderMaximumTransactionAmountLabel()}
      </HStack>

      <HStack spacing={1} w="full">
        {/*input*/}
        <NumberInput
          colorScheme={primaryColorScheme}
          clampValueOnBlur={false}
          focusBorderColor={primaryColor}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          size="lg"
          value={value || undefined}
          w="full"
        >
          <NumberInputField textAlign="right" />
        </NumberInput>

        {/*maximum button*/}
        <Button
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          aria-label="Add maximum amount"
          borderRadius={0}
          fontSize="md"
          onClick={handleMaximumAmountClick}
          p={0}
          size="md"
          variant="ghost"
        >
          <Text color={defaultTextColor} fontSize="md">
            {t<string>('labels.max').toUpperCase()}
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
};

export default SendAmountInput;
