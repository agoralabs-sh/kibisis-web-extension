import {
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

const ClientHeaderSkeleton: FC = () => (
  <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
    <HStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
      <SkeletonCircle size="10" />

      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="space-evenly"
        spacing={1}
        w="full"
      >
        {/*name*/}
        <Skeleton>
          <Heading size="md">{faker.commerce.productName()}</Heading>
        </Skeleton>

        {/*host*/}
        <Skeleton>
          <Text fontSize="xs">{faker.internet.domainName()}</Text>
        </Skeleton>
      </VStack>

      {/*description*/}
      <Skeleton>
        <Text fontSize="sm">{faker.random.words(8)}</Text>
      </Skeleton>

      <Skeleton>
        <Heading size="md" textAlign="center">
          {faker.commerce.productName()}
        </Heading>
      </Skeleton>
    </HStack>
  </VStack>
);

export default ClientHeaderSkeleton;
