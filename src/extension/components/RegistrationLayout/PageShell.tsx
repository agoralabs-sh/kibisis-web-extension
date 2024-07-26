import { Center, Flex, FlexProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

interface IProps extends FlexProps {
  children: ReactNode;
  withPadding?: boolean;
}

const PageShell: FC<IProps> = ({ children, withPadding = false }: IProps) => (
  <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      minH="100vh"
      pt={withPadding ? DEFAULT_GAP : 0}
      px={withPadding ? DEFAULT_GAP : 0}
      w="full"
    >
      {children}
    </Flex>
  </Center>
);

export default PageShell;
