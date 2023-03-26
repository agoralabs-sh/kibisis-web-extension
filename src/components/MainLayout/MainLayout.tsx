import { Box, HStack, IconButton, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { IoChevronForward } from 'react-icons/io5';

interface IProps {
  children: ReactNode;
}

const MainLayout: FC<IProps> = ({ children }: IProps) => {
  return (
    <HStack alignItems="flex-start" minH="100vh" w="full">
      <VStack
        borderRightColor="gray.300"
        borderRightStyle="solid"
        borderRightWidth={1}
        minH="100vh"
        spacing={0}
      >
        <IconButton
          aria-label="Open drawer"
          icon={<IoChevronForward />}
          variant="ghost"
        />
        <Box
          borderTopColor="gray.300"
          borderTopStyle="solid"
          borderTopWidth={1}
          m={0}
          w="full"
        />
      </VStack>
      <VStack flexGrow={1} minH="100vh" pt={4} px={4}>
        {children}
      </VStack>
    </HStack>
  );
};

export default MainLayout;
