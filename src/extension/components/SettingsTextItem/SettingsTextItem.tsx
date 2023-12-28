import {
  Box,
  HStack,
  ResponsiveValue,
  StackProps,
  Text,
} from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { FC, PropsWithChildren } from 'react';

// constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps extends PropsWithChildren<StackProps> {
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  label: string;
}

const SettingsTextItem: FC<IProps> = ({
  children,
  fontSize,
  label,
  ...stackProps
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={SETTINGS_ITEM_HEIGHT / 2}
      px={DEFAULT_GAP - 2}
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

export default SettingsTextItem;
