import {
  Box,
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

// hooks
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

const SignTxnsHeaderSkeleton: FC = () => {
  // hookes
  const textBackgroundColor: string = useTextBackgroundColor();

  return (
    <>
      <HStack alignItems="center" justifyContent="center" spacing={4} w="full">
        {/*avatar*/}
        <SkeletonCircle size="10" />

        <VStack
          alignItems="flex-start"
          justifyContent="space-evenly"
          spacing={1}
          w="full"
        >
          {/*name*/}
          <Skeleton>
            <Heading size="md" textAlign="center">
              {faker.commerce.productName()}
            </Heading>
          </Skeleton>

          {/*host*/}
          <Skeleton>
            <Box
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={DEFAULT_GAP / 3}
              py={1}
            >
              <Text fontSize="xs" textAlign="center">
                {faker.internet.domainName()}
              </Text>
            </Box>
          </Skeleton>
        </VStack>
      </HStack>

      {/*caption*/}
      <Skeleton>
        <Text fontSize="xs" textAlign="center">
          {faker.random.words(8)}
        </Text>
      </Skeleton>
    </>
  );
};

export default SignTxnsHeaderSkeleton;
