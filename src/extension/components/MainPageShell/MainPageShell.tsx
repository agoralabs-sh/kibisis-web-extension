import { Center, Flex, FlexProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

interface IProps extends FlexProps {
  children: ReactNode;
}

const MainPageShell: FC<IProps> = ({ children }: IProps) => (
  <Center as="main" backgroundColor="var(--chakra-colors-chakra-body-bg)">
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      minH="100vh"
      w="full"
    >
      {children}
    </Flex>
  </Center>
);

export default MainPageShell;
