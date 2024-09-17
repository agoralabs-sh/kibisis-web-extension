import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { type FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { ISelectOptionProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SelectOption: FC<ISelectOptionProps> = ({
  color,
  fontSize = 'md',
  value,
}) => {
  // hooks
  const subTextColor = useSubTextColor();
  // misc
  const textColor = color || subTextColor;

  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      m={0}
      p={DEFAULT_GAP / 2}
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      {/*icon*/}
      {value.icon && (
        <Icon as={value.icon} boxSize={calculateIconSize()} color={textColor} />
      )}

      {/*label*/}
      <Text color={textColor} fontSize={fontSize} maxW={250} noOfLines={1}>
        {value.label}
      </Text>
    </HStack>
  );
};

export default SelectOption;
