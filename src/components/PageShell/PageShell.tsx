import { Center, Flex, FlexProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

interface IProps extends FlexProps {
  children: ReactNode;
  noPadding?: boolean;
}

const PageShell: FC<IProps> = ({ children, noPadding = false }: IProps) => (
  <Center as="main" backgroundColor="white">
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      minH="100vh"
      pt={noPadding ? 0 : 8}
      px={noPadding ? 0 : 8}
      w="full"
    >
      {children}
    </Flex>
  </Center>
);

export default PageShell;
