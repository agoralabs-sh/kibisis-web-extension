import { Button as ChakraButton, HStack, Skeleton } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronDown } from 'react-icons/io5';

// components
import NetworkBadge from '@extension/components/NetworkBadge';

// types
import { INetwork } from '@extension/types';

interface IProps {
  network: INetwork;
}

const NetworkSelectSkeleton: FC<IProps> = ({ network }: IProps) => (
  <HStack justifyContent="flex-end" w="full">
    <Skeleton>
      <ChakraButton rightIcon={<IoChevronDown />} variant="ghost">
        <NetworkBadge network={network} />
      </ChakraButton>
    </Skeleton>
  </HStack>
);

export default NetworkSelectSkeleton;
