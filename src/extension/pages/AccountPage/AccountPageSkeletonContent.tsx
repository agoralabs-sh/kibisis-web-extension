import {
  Heading,
  HStack,
  Skeleton,
  Spacer,
  StackProps,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC } from 'react';

// components
import { NetworkSelectSkeleton } from '@extension/components/NetworkSelect';
import { NativeBalanceSkeleton } from '@extension/components/NativeBalance';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectNetworks } from '@extension/selectors';

const AccountPageSkeletonContent: FC<StackProps> = (props) => {
  // selectors
  const networks = useSelectNetworks();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <VStack {...props}>
      <NetworkSelectSkeleton network={networks[0]} />

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
