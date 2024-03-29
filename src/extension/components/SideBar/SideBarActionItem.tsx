import { Button, Center, HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import React, { FC, MouseEvent } from 'react';
import { IconType } from 'react-icons';

// constants
import { SIDEBAR_ITEM_HEIGHT, SIDEBAR_MIN_WIDTH } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  icon: IconType;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const SideBarActionItem: FC<IProps> = ({ icon, label, onClick }: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Tooltip aria-label={label} label={label}>
      <Button
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        borderRadius={0}
        fontSize="md"
        h={SIDEBAR_ITEM_HEIGHT}
        justifyContent="start"
        onClick={onClick}
        p={0}
        variant="ghost"
        w="full"
      >
        <HStack h="40px" pr={2} py={1} spacing={0} w="full">
          <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
            <Icon as={icon} color={defaultTextColor} />
          </Center>
          <Text color={defaultTextColor} fontSize="sm">
            {label}
          </Text>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default SideBarActionItem;
