import { Center, Flex, FlexProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

interface IProps extends FlexProps {
  children: ReactNode;
}

const PageShell: FC<IProps> = ({ children }: IProps) => (
  <Center as="main" backgroundColor="white">
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      maxW={500}
      minH="100vh"
      pt={8}
      px={8}
      w="full"
    >
      {children}
    </Flex>
  </Center>
);

export default PageShell;
