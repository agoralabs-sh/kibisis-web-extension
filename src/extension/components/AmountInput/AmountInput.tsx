import {
  Button,
  HStack,
  Icon,
  NumberInput,
  NumberInputField,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import BigNumber from 'bignumber.js';
import numbro from 'numbro';
import React, { type FC, type FocusEvent, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { randomBytes } from 'tweetnacl';

// components
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

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
import type { IProps } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

const AmountInput: FC<IProps> = ({
  account,
  asset,
  disabled = false,
  id,
  network,
  maximumTransactionAmount,
  onChange,
  required = false,
  value,
}) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // misc
  const balance = new BigNumber(
    account.networkInformation[
      convertGenesisHashToHex(network.genesisHash).toUpperCase()
    ]?.atomicBalance || 0
  );
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  const minBalance = new BigNumber(
    account.networkInformation[
      convertGenesisHashToHex(network.genesisHash).toUpperCase()
    ]?.minAtomicBalance || 0
  );
  const maximumTransactionAmountInStandardUnit = convertToStandardUnit(
    new BigNumber(maximumTransactionAmount),
    asset.decimals
  );
  // handlers
  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    const blurValue = new BigNumber(event.target.value || '0');

    // if the entered value is greater than the maximum allowed, use the max
    if (blurValue.gt(maximumTransactionAmountInStandardUnit)) {
      onChange(maximumTransactionAmountInStandardUnit.toString());

      return;
    }

    // format the number to use an absolute value (no negatives), the maximum decimals for the asset and trim any zeroes
    onChange(
      numbro(blurValue.absoluteValue().toString()).format({
        mantissa: asset.decimals,
        trimMantissa: true,
      })
    );
  };
  const handleOnChange = (valueAsString: string | undefined) =>
    onChange(valueAsString || '');
  const handleOnFocus = (event: FocusEvent<HTMLInputElement>) => {
    // remove the padded zero
    if (event.target.value === '0') {
      onChange('');
    }
  };
  const handleMaximumAmountClick = () =>
    onChange(maximumTransactionAmountInStandardUnit.toString());
  // renders
  const renderMaximumTransactionAmountLabel = () => {
    let symbol = '';
    let maximumTransactionAmountLabel: ReactElement;

    switch (asset.type) {
      case AssetTypeEnum.ARC0200:
      case AssetTypeEnum.Native:
        symbol = asset.symbol;
        break;
      case AssetTypeEnum.Standard:
        symbol = asset.unitName || '';
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
              { decimals: asset.decimals }
            )} ${symbol}`}
          </Text>
        </HStack>
      </Tooltip>
    );

    if (asset.type === AssetTypeEnum.Native) {
      return (
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          w="full"
        >
          <Tooltip
            aria-label="Maximum transaction amount"
            label={t<string>(
              'captions.maximumNativeCurrencyTransactionAmount',
              {
                balance: formatCurrencyUnit(
                  convertToStandardUnit(balance, asset.decimals),
                  { decimals: asset.decimals }
                ),
                minBalance: formatCurrencyUnit(
                  convertToStandardUnit(minBalance, asset.decimals),
                  { decimals: asset.decimals }
                ),
                minFee: formatCurrencyUnit(
                  convertToStandardUnit(
                    new BigNumber(network.minFee),
                    asset.decimals
                  ),
                  { decimals: asset.decimals }
                ),
                nativeCurrencyCode: asset.symbol,
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
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      <HStack justifyContent="space-between" spacing={1} w="full">
        {/*label*/}
        <Label
          inputID={_id}
          label={t<string>('labels.amount')}
          px={DEFAULT_GAP - 2}
          required={required}
        />

        {/*maximum amount*/}
        {renderMaximumTransactionAmountLabel()}
      </HStack>

      <HStack spacing={1} w="full">
        {/*input*/}
        <NumberInput
          colorScheme={primaryColorScheme}
          clampValueOnBlur={false}
          focusBorderColor={primaryColor}
          id={_id}
          isDisabled={disabled}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          value={value || undefined}
          w="full"
        >
          <NumberInputField
            borderRadius="full"
            h={INPUT_HEIGHT}
            p={DEFAULT_GAP - 2}
            textAlign="right"
          />
        </NumberInput>

        {/*maximum button*/}
        <Button
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          aria-label="Add maximum amount"
          borderRadius="md"
          h="100%"
          onClick={handleMaximumAmountClick}
          p={0}
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

export default AmountInput;
