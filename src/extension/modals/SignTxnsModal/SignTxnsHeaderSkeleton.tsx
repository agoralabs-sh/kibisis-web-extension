import {
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

const SignTxnsHeaderSkeleton: FC = () => (
  <>
    <HStack alignItems="center" justifyContent="center" spacing={4} w="full">
      <SkeletonCircle size="10" />
      <Skeleton>
        <Heading size="md" textAlign="center">
          {faker.commerce.productName()}
        </Heading>
      </Skeleton>
    </HStack>
    <Skeleton>
      <Text fontSize="xs" textAlign="center">
        {faker.internet.domainName()}
      </Text>
    </Skeleton>
    <Skeleton>
      <Text fontSize="xs" textAlign="center">
        {faker.random.words(8)}
      </Text>
    </Skeleton>
    <Skeleton>
      <Tag size="sm">
        <TagLabel>{faker.internet.domainName()}</TagLabel>
      </Tag>
    </Skeleton>
  </>
);

export default SignTxnsHeaderSkeleton;
