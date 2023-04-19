import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { createIconFromDataUri } from '@extension/utils';

// Theme
import { theme } from '@extension/theme';

// Types
import { INativeCurrency } from '@extension/types';

interface IProps {
  atomicBalance: BigNumber;
  minAtomicBalance: BigNumber;
  nativeCurrency: INativeCurrency;
}

const NativeBalance: FC<IProps> = ({
  atomicBalance,
  minAtomicBalance,
  nativeCurrency,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const balanceStandardUnit: BigNumber = convertToStandardUnit(
    atomicBalance,
    nativeCurrency.decimals
  );
  const minumumStandardUnit: BigNumber = convertToStandardUnit(
    minAtomicBalance,
    nativeCurrency.decimals
  );

  return (
    <HStack alignItems="center" justifyContent="center" spacing={1}>
      <Tooltip
        aria-label="Minimum balance information"
        label={t<string>('captions.minimumBalance', {
          amount: formatCurrencyUnit(minumumStandardUnit),
        })}
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
      <Tooltip
        aria-label="Full balance"
        label={`${balanceStandardUnit.toString()} ${nativeCurrency.code.toUpperCase()}`}
      >
        <HStack
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={2}
          py={1}
          spacing={1}
        >
          <Text color={defaultTextColor} fontSize="sm">{`${t<string>(
            'labels.balance'
          )}:`}</Text>
          <Text color={defaultTextColor} fontSize="sm">
            {formatCurrencyUnit(balanceStandardUnit)}
          </Text>
          {createIconFromDataUri(nativeCurrency.iconUri, {
            color: 'black.500',
            h: 3,
            w: 3,
          })}
        </HStack>
      </Tooltip>
    </HStack>
  );
};

export default NativeBalance;
