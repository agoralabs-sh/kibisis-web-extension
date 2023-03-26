import { Button, Center, HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC, MouseEvent } from 'react';
import { IconType } from 'react-icons';

// Constants
import { SIDEBAR_MIN_WIDTH } from '../../constants';

interface IProps {
  icon: IconType;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const SideBarActionItem: FC<IProps> = ({ icon, label, onClick }: IProps) => (
  <Button
    colorScheme="gray"
    fontSize="md"
    justifyContent="start"
    onClick={onClick}
    p={0}
    variant="ghost"
    w="full"
  >
    <HStack h="40px" pr={2} py={1} spacing={0} w="full">
      <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
        <Icon as={icon} />
      </Center>
      <Text color="gray.500" fontSize="sm">
        {label}
      </Text>
    </HStack>
  </Button>
);

export default SideBarActionItem;
