import { Button as ChakraButton, HStack, Skeleton } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronDown } from 'react-icons/io5';

// Components
import ChainBadge from '@extension/components/ChainBadge';

// Types
import { INetwork } from '@extension/types';

interface IProps {
  network: INetwork;
}

const NetworkSelectSkeleton: FC<IProps> = ({ network }: IProps) => (
  <HStack justifyContent="flex-end" w="full">
    <Skeleton>
      <ChakraButton rightIcon={<IoChevronDown />} variant="ghost">
        <ChainBadge network={network} />
      </ChakraButton>
    </Skeleton>
  </HStack>
);

export default NetworkSelectSkeleton;
