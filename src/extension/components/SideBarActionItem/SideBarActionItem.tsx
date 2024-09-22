import { Button, Center, HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import React, { type FC } from 'react';

// constants
import {
  DEFAULT_GAP,
  SIDEBAR_ITEM_HEIGHT,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SideBarActionItem: FC<IProps> = ({
  icon,
  isShortForm,
  label,
  onClick,
}) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();

  return (
    <Tooltip aria-label={label} label={label}>
      <Button
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        borderRadius={0}
        fontSize="md"
        minH={SIDEBAR_ITEM_HEIGHT}
        justifyContent="start"
        onClick={onClick}
        p={0}
        variant="ghost"
        w="full"
      >
        <HStack pr={DEFAULT_GAP / 3} py={1} spacing={0} w="full">
          <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
            <Icon
              as={icon}
              boxSize={calculateIconSize()}
              color={subTextColor}
            />
          </Center>

          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="left"
            {...(isShortForm && {
              display: 'none',
            })}
          >
            {label}
          </Text>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default SideBarActionItem;
