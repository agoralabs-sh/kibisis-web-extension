import { HStack, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

// Components
import SideBar from '@extension/components/SideBar';

// Constants
import { SIDEBAR_BORDER_WIDTH, SIDEBAR_MIN_WIDTH } from '@extension/constants';

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
        spacing={0}
        style={{
          marginInlineStart: '0px',
        }}
        w="full"
      >
        {children}
      </VStack>
    </HStack>
  );
};

export default MainLayout;
