import {
  Heading,
  HStack,
  Skeleton,
  Spacer,
  StackProps,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// components
import { NetworkSelectSkeleton } from '@extension/components/NetworkSelect';
import { NativeBalanceSkeleton } from '@extension/components/NativeBalance';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { INetwork } from '@extension/types';

interface IProps extends StackProps {
  network: INetwork;
}

const AccountPageSkeletonContent: FC<IProps> = ({
  network,
  ...stackProps
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <VStack {...stackProps}>
      <NetworkSelectSkeleton network={network} />

      <HStack alignItems="center" w="full">
        {/*name/address*/}
        <Skeleton>
          <Heading color={defaultTextColor} size="md" textAlign="left">
            {faker.random.alphaNumeric(12).toUpperCase()}
          </Heading>
        </Skeleton>

        <Spacer />

        {/*balance*/}
        <NativeBalanceSkeleton />
      </HStack>
    </VStack>
  );
};

export default AccountPageSkeletonContent;
