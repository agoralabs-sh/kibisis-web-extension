import {
  Button,
  Center,
  ColorMode,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import React, { FC, MouseEvent, useState } from 'react';
import { IconType } from 'react-icons';

// Constants
import { SIDEBAR_ITEM_HEIGHT, SIDEBAR_MIN_WIDTH } from '../../constants';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

// Selectors
import { useSelectColorMode } from '../../selectors';

interface IProps {
  icon: IconType;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const SideBarActionItem: FC<IProps> = ({ icon, label, onClick }: IProps) => {
  const colorMode: ColorMode = useSelectColorMode();
  const defaultTextColor: string = useDefaultTextColor();
  const [active, setActive] = useState<boolean>(false);
  const handleMouseOver = () => setActive(!active);

  return (
    <Button
      borderRadius={0}
      // colorScheme="gray"
      fontSize="md"
      h={SIDEBAR_ITEM_HEIGHT}
      justifyContent="start"
      onClick={onClick}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver}
      p={0}
      variant="ghost"
      w="full"
    >
      <HStack h="40px" pr={2} py={1} spacing={0} w="full">
        <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
          <Icon
            as={icon}
            color={
              active && colorMode === 'dark' ? 'gray.500' : defaultTextColor
            }
          />
        </Center>
        <Text
          color={active && colorMode === 'dark' ? 'gray.500' : defaultTextColor}
          fontSize="sm"
        >
          {label}
        </Text>
      </HStack>
    </Button>
  );
};

export default SideBarActionItem;
