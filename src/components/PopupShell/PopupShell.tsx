import {
  Center,
  Flex,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const PopupShell: FC<IProps> = ({ children }: IProps) => (
  <Center as="main" backgroundColor="white">
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      maxW={500}
      minH="100vh"
      p={10}
      w="full"
    >
      {children}
    </Flex>
  </Center>
);

export default PopupShell;
