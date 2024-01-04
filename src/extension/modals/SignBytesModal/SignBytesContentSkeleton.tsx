import {
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { FC } from 'react';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';
import { DEFAULT_GAP } from '@extension/constants';

const SignBytesContentSkeleton: FC = () => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <VStack spacing={4} w="full">
      <HStack py={DEFAULT_GAP - 2} spacing={4} w="full">
        <SkeletonCircle size="12" />

        <Skeleton flexGrow={1}>
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {ellipseAddress(generateAccount().addr, {
              end: 10,
              start: 10,
            })}
          </Text>
        </Skeleton>
      </HStack>

      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={`sign-bytes-modal-fetching-item-${index}`}>
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {ellipseAddress(generateAccount().addr, {
              end: 10,
              start: 10,
            })}
          </Text>
        </Skeleton>
      ))}
    </VStack>
  );
};

export default SignBytesContentSkeleton;
