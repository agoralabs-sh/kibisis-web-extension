import { HStack, Skeleton, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AlgorandIcon from '@extension/components/AlgorandIcon';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const NativeBalanceSkeleton: FC = () => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Skeleton>
      <HStack
        backgroundColor="gray.200"
        borderRadius={25}
        px={2}
        py={1}
        spacing={1}
      >
        <Text color={defaultTextColor} fontSize="sm">{`${t<string>(
          'labels.balance'
        )}:`}</Text>
        <Text color={defaultTextColor} fontSize="sm">
          0
        </Text>
        <AlgorandIcon color="black" h={3} w={3} />
      </HStack>
    </Skeleton>
  );
};

export default NativeBalanceSkeleton;
