import {
  Card,
  Center,
  Flex,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const OnboardShell: FC<IProps> = ({ children }: IProps) => (
  <Center as="main" backgroundColor="gray.100">
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      maxW={500}
      minH="100vh"
      w="full"
    >
      <Card p={10}>{children}</Card>
    </Flex>
  </Center>
);

export default OnboardShell;
