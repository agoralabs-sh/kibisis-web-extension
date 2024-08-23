import { Center, HStack, VStack } from '@chakra-ui/react';
import React, { type FC, type PropsWithChildren } from 'react';

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

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  // selectors
  const isSideBarShowing = useSelectSideBar();

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
      <HStack alignItems="flex-start" h="100vh" w="full">
        {isSideBarShowing && <SideBar />}
        <VStack
          flexGrow={1}
          h="100vh"
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
