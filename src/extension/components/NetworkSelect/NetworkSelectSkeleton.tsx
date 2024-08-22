import { Button as ChakraButton, HStack, Skeleton } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoChevronDown } from 'react-icons/io5';

const NetworkSelectSkeleton: FC = () => (
  <HStack justifyContent="flex-end" w="full">
    <Skeleton>
      <ChakraButton rightIcon={<IoChevronDown />} variant="ghost">
        Network selection
      </ChakraButton>
    </Skeleton>
  </HStack>
);

export default NetworkSelectSkeleton;
