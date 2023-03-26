import { HStack, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

// Components
import SideBar from '../SideBar';

// Constants
import { SIDEBAR_BORDER_WIDTH, SIDEBAR_MIN_WIDTH } from '../../constants';

interface IProps {
  children: ReactNode;
}

const MainLayout: FC<IProps> = ({ children }: IProps) => {
  return (
    <HStack alignItems="flex-start" minH="100vh" w="full">
      <SideBar />
      <VStack
        flexGrow={1}
        minH="100vh"
        pl={`${SIDEBAR_MIN_WIDTH + SIDEBAR_BORDER_WIDTH}px`}
        pr={4}
        pt={4}
      >
        {children}
      </VStack>
    </HStack>
  );
};

export default MainLayout;
