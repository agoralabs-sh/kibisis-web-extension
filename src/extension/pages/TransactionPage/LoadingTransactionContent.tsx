import { Skeleton, Text, VStack } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import React, { FC } from 'react';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

const LoadingTransactionContent: FC = () => (
  <VStack
    alignItems="flex-start"
    justifyContent="flex-start"
    px={DEFAULT_GAP}
    spacing={4}
    w="full"
  >
    {Array.from({ length: 3 }, () => (
      <Skeleton key={nanoid()} w="full">
        <Text fontSize="sm" w="full">
          {faker.random.alphaNumeric(10)}
        </Text>
      </Skeleton>
    ))}
  </VStack>
);

export default LoadingTransactionContent;
