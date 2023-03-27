import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

const Divider: FC = () => (
  <Box
    borderTopColor="gray.300"
    borderTopStyle="solid"
    borderTopWidth={1}
    m={0}
    w="full"
  />
);

export default Divider;
