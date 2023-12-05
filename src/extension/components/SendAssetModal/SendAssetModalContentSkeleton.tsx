import { VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const SendAssetModalContentSkeleton: FC = () => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return <VStack w="full"></VStack>;
};

export default SendAssetModalContentSkeleton;
