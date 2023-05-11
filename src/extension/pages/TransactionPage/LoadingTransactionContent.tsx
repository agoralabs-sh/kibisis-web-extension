import { Skeleton, Text } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import React, { FC } from 'react';

const LoadingTransactionContent: FC = () => (
  <>
    {Array.from({ length: 3 }, () => (
      <Skeleton key={nanoid()} w="full">
        <Text fontSize="sm" w="full">
          {faker.random.alphaNumeric(10)}
        </Text>
      </Skeleton>
    ))}
  </>
);

export default LoadingTransactionContent;
