import { HStack, Text, Tooltip } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import InformationIcon from '@extension/components/InformationIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const NativeBalance: FC<IProps> = ({
  atomicBalance,
  minAtomicBalance,
  nativeCurrency,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // misc
  const balanceStandardUnit = convertToStandardUnit(
    atomicBalance,
    nativeCurrency.decimals
  );
  const minimumStandardUnit = convertToStandardUnit(
    minAtomicBalance,
    nativeCurrency.decimals
  );

  return (
    <HStack alignItems="center" justifyContent="center" spacing={1}>
      <Tooltip
        aria-label="Full balance"
        label={`${formatCurrencyUnit(balanceStandardUnit, {
          decimals: nativeCurrency.decimals,
          thousandSeparatedOnly: true,
        })} ${nativeCurrency.symbol.toUpperCase()}`}
      >
        <HStack
          backgroundColor={textBackgroundColor}
          borderRadius="full"
          px={DEFAULT_GAP / 2}
          py={1}
          spacing={1}
        >
          <Text color={defaultTextColor} fontSize="sm">{`${t<string>(
            'labels.balance'
          )}:`}</Text>

          <Text color={defaultTextColor} fontSize="sm">
            {formatCurrencyUnit(balanceStandardUnit, {
              decimals: nativeCurrency.decimals,
            })}
          </Text>

          {createIconFromDataUri(nativeCurrency.iconUrl, {
            color: defaultTextColor,
            boxSize: calculateIconSize('xs'),
          })}
        </HStack>
      </Tooltip>

      {/*minimum balance icon*/}
      <InformationIcon
        ariaLabel="Minimum balance information"
        tooltipLabel={t<string>('captions.minimumBalance', {
          amount: formatCurrencyUnit(minimumStandardUnit, {
            decimals: nativeCurrency.decimals,
          }),
          code: nativeCurrency.symbol.toUpperCase(),
        })}
      />
    </HStack>
  );
};

export default NativeBalance;
