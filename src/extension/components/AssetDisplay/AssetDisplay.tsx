import { HStack, ResponsiveValue, Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import * as CSS from 'csstype';
import React, { FC, ReactNode } from 'react';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';

interface IProps {
  atomicUnitAmount: BigNumber;
  color?: ResponsiveValue<CSS.Property.Color>;
  decimals: number;
  displayUnit?: boolean;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  icon?: ReactNode;
  prefix?: '+' | '-';
  unit?: string;
}

const AssetDisplay: FC<IProps> = ({
  atomicUnitAmount,
  color,
  decimals,
  displayUnit = false,
  fontSize = 'sm',
  icon,
  prefix,
  unit,
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Tooltip
      aria-label="Asset amount with unrestricted decimals"
      label={`${convertToStandardUnit(atomicUnitAmount, decimals).toString()}${
        unit ? ` ${unit}` : ''
      }`}
    >
      <HStack spacing={1}>
        <Text color={color || defaultTextColor} fontSize={fontSize}>
          {`${prefix || ''}${formatCurrencyUnit(
            convertToStandardUnit(atomicUnitAmount, decimals)
          )}`}
        </Text>
        {icon}
        {displayUnit && unit && (
          <Text color={color || defaultTextColor} fontSize={fontSize}>
            {unit}
          </Text>
        )}
      </HStack>
    </Tooltip>
  );
};

export default AssetDisplay;
