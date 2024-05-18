import {
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const SignMessageContentSkeleton: FC = () => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <VStack spacing={DEFAULT_GAP - 2} w="full">
      <HStack py={DEFAULT_GAP - 2} spacing={DEFAULT_GAP - 2} w="full">
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

      <VStack justifyContent="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={`sign-message-modal-fetching-item-${index}`}>
            <Text color={defaultTextColor} fontSize="md" textAlign="center">
              {ellipseAddress(generateAccount().addr, {
                end: 10,
                start: 10,
              })}
            </Text>
          </Skeleton>
        ))}
      </VStack>
    </VStack>
  );
};

export default SignMessageContentSkeleton;
