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
import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';

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
  IAsset,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import {
  convertToAtomicUnit,
  convertToStandardUnit,
  formatCurrencyUnit,
} from '@common/utils';
import { convertGenesisHashToHex } from '@extension/utils';

interface IProps {
  account: IAccount;
  network: INetworkWithTransactionParams;
  maximumTransactionAmount: string;
  onValueChange: (value: string) => void;
  selectedAsset: IAsset;
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
  const assetDecimals: number =
    selectedAsset.id !== '0'
      ? selectedAsset.decimals
      : network.nativeCurrency.decimals;
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
  const handleMaximumAmountClick = () =>
    onValueChange(maximumTransactionAmount);
  const handleValueChange = (valueInStandardUnit: string) => {
    onValueChange(
      valueInStandardUnit?.length > 1
        ? convertToAtomicUnit(
            new BigNumber(valueInStandardUnit),
            assetDecimals
          ).toString()
        : '0'
    );
  };
  // renders
  const renderMaximumTransactionAmountLabel = () => {
    const maximumTransactionAmountLabel: ReactElement = (
      <HStack
        backgroundColor={textBackgroundColor}
        borderRadius={theme.radii['3xl']}
        px={2}
        py={1}
        spacing={1}
      >
        <Text color={subTextColor} fontSize="xs" textAlign="right">
          {`${t<string>(
            'labels.max'
          )}: ${maximumTransactionAmountInStandardUnit.toString()} ${
            selectedAsset.unitName
          }`}
        </Text>
      </HStack>
    );

    if (selectedAsset.id === '0') {
      return (
        <HStack alignItems="center" justifyContent="center" spacing={1}>
          <Tooltip
            aria-label="Maximum transaction amount"
            label={t<string>(
              'captions.maximumNativeCurrencyTransactionAmount',
              {
                balance: formatCurrencyUnit(
                  convertToStandardUnit(
                    balance,
                    network.nativeCurrency.decimals
                  )
                ),
                minBalance: formatCurrencyUnit(
                  convertToStandardUnit(
                    minBalance,
                    network.nativeCurrency.decimals
                  )
                ),
                minFee: formatCurrencyUnit(
                  convertToStandardUnit(
                    new BigNumber(network.minFee),
                    network.nativeCurrency.decimals
                  )
                ),
                nativeCurrencyCode: network.nativeCurrency.code,
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
        <Text color={defaultTextColor} fontSize="sm" textAlign="left">
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
          defaultValue={0}
          focusBorderColor={primaryColor}
          max={maximumTransactionAmountInStandardUnit.toNumber()}
          min={0}
          onChange={handleValueChange}
          precision={assetDecimals}
          size="lg"
          step={convertToStandardUnit(
            new BigNumber(1),
            assetDecimals
          ).toNumber()}
          value={
            value
              ? convertToStandardUnit(
                  new BigNumber(value),
                  assetDecimals
                ).toString()
              : undefined
          }
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
          size="lg"
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
