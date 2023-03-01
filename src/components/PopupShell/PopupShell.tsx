import {
  Flex,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const PopupShell: FC<IProps> = ({ children }: IProps) => (
  <Flex
    as="main"
    direction="column"
    h={600}
    pt={5}
    px={5}
    w={400}
  >
    {children}
  </Flex>
);

export default PopupShell;
