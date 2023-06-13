import {
  Box,
  HStack,
  ResponsiveValue,
  StackProps,
  Text,
} from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { FC, PropsWithChildren } from 'react';

// Constants
import { ITEM_HEIGHT } from './constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps extends PropsWithChildren<StackProps> {
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  label: string;
}

const PageItem: FC<IProps> = ({
  children,
  fontSize = 'sm',
  label,
  ...stackProps
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={ITEM_HEIGHT}
      spacing={2}
      w="full"
      {...stackProps}
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize={fontSize}>
        {`${label}:`}
      </Text>

      {/*value*/}
      <Box>{children}</Box>
    </HStack>
  );
};

export default PageItem;
