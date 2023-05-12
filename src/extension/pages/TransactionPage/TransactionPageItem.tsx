import { Box, HStack, Text } from '@chakra-ui/react';
import React, { FC, PropsWithChildren } from 'react';

// Constants
import { ITEM_HEIGHT } from './constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps extends PropsWithChildren {
  label: string;
}

const TransactionPageItem: FC<IProps> = ({ children, label }: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={ITEM_HEIGHT}
      spacing={2}
      w="full"
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize="sm">
        {label}
      </Text>

      {/*value*/}
      <Box>{children}</Box>
    </HStack>
  );
};

export default TransactionPageItem;
