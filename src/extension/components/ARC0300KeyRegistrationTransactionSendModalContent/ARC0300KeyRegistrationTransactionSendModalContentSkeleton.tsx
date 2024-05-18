import { ModalBody, ModalContent, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// theme
import { theme } from '@extension/theme';

const ARC0300KeyRegistrationTransactionSendModalContentSkeleton: FC = () => {
  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
    >
      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <VStack spacing={DEFAULT_GAP / 3} w="full">
            <ModalSkeletonItem />
            <ModalSkeletonItem />
            <ModalSkeletonItem />
          </VStack>
        </VStack>
      </ModalBody>
    </ModalContent>
  );
};

export default ARC0300KeyRegistrationTransactionSendModalContentSkeleton;
