import {
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import BigNumber from 'bignumber.js';
import React, { type FC, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { randomBytes } from 'tweetnacl';

// components
import Label from '@extension/components/Label';
import InformationIcon from '@extension/components/InformationIcon';

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
  id,
  label,
  network,
  maximumAmountInAtomicUnits,
  onMaximumAmountClick,
  required = false,
  ...inputProps
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
    new BigNumber(maximumAmountInAtomicUnits),
    asset.decimals
  );
  // handlers
  const handleMaximumAmountClick = () => {
    onMaximumAmountClick({
      asset,
      maximumAmountInAtomicUnits,
    });
  };
  // renders
  const renderMaximumTransactionAmountLabel = () => {
    let informationLabel: string;
    let maximumTransactionAmountLabel: ReactElement;
    let symbol = '';

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
      informationLabel = t<string>(
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
      );

      return (
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          w="full"
        >
          <InformationIcon
            ariaLabel={informationLabel}
            tooltipLabel={informationLabel}
          />

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
          label={label || t<string>('labels.amount')}
          px={DEFAULT_GAP - 2}
          required={required}
        />

        {/*maximum amount*/}
        {renderMaximumTransactionAmountLabel()}
      </HStack>

      <HStack spacing={1} w="full">
        {/*input*/}
        <NumberInput
          {...inputProps}
          colorScheme={primaryColorScheme}
          clampValueOnBlur={false}
          focusBorderColor={primaryColor}
          id={_id}
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
          aria-label={t<string>('labels.addMaximumAmount')}
          borderRadius="md"
          h="full"
          onClick={handleMaximumAmountClick}
          p={0}
          variant="ghost"
        >
          <Text color={defaultTextColor} fontSize="md">
            {t<string>('buttons.max').toUpperCase()}
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
};

export default AmountInput;
