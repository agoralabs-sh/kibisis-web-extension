import { HStack, Skeleton, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AlgorandIcon from '@extension/components/AlgorandIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// theme
import { theme } from '@extension/theme';

const NativeBalanceSkeleton: FC = () => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <Skeleton>
      <HStack
        backgroundColor="gray.200"
        borderRadius={theme.radii['3xl']}
        px={DEFAULT_GAP / 3}
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
