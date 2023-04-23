import { HStack, Skeleton, Text } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

const SignTxnsLoadingItem: FC = () => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();

  return (
    <HStack justifyContent="space-between" spacing={2} w="full">
      <Skeleton>
        <Text color={defaultTextColor} fontSize="xs">{`${faker.random.alpha(
          6
        )}:`}</Text>
      </Skeleton>
      <Skeleton>
        <Text color={subTextColor} fontSize="xs">
          {faker.random.alpha(8)}
        </Text>
      </Skeleton>
    </HStack>
  );
};

export default SignTxnsLoadingItem;
