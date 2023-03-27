import { HStack, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

// Components
import SideBar from '../SideBar';
import MainHeader from './MainHeader';

// Constants
import { SIDEBAR_BORDER_WIDTH, SIDEBAR_MIN_WIDTH } from '../../constants';

interface IProps {
  children: ReactNode;
  showHeader?: boolean;
  title: string;
}

const MainLayout: FC<IProps> = ({
  children,
  showHeader = true,
  title,
}: IProps) => {
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
      >
        {showHeader && <MainHeader title={title} />}
        <VStack flexGrow={1} pt={4} px={4} w="full">
          {children}
        </VStack>
      </VStack>
    </HStack>
  );
};

export default MainLayout;
