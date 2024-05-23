import { Center, HStack, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

// components
import SideBar from '@extension/components/SideBar';

// constants
import {
  BODY_BACKGROUND_COLOR,
  SIDEBAR_BORDER_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// selectors
import { useSelectSideBar } from '@extension/selectors';

interface IProps {
  children: ReactNode;
}

const MainLayout: FC<IProps> = ({ children }: IProps) => {
  const isSideBarShowing = useSelectSideBar();

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
      <HStack alignItems="flex-start" minH="100vh" w="full">
        {isSideBarShowing && <SideBar />}
        <VStack
          flexGrow={1}
          minH="100vh"
          pl={
            isSideBarShowing
              ? `${SIDEBAR_MIN_WIDTH + SIDEBAR_BORDER_WIDTH}px`
              : 0
          }
          spacing={0}
          style={{
            marginInlineStart: '0px',
          }}
          w="full"
        >
          {children}
        </VStack>
      </HStack>
    </Center>
  );
};

export default MainLayout;
