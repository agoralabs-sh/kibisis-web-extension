import { Box, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const TransactionItemSkeleton: FC = () => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <Box px={3} py={2} w="full">
      <VStack
        alignItems="flex-start"
        justifyContent="center"
        spacing={2}
        w="full"
      >
        <Skeleton>
          <Text color={defaultTextColor} fontSize="sm">
            {t<string>('headings.transaction', {
              context: TransactionTypeEnum.ApplicationNoOp,
            })}
          </Text>
        </Skeleton>

        <HStack
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          w="full"
        >
          <Skeleton>
            <Text color={defaultTextColor} fontSize="xs">
              {ellipseAddress(generateAccount().addr, {
                end: 10,
                start: 10,
              })}
            </Text>
          </Skeleton>

          <Skeleton>
            <Text color={defaultTextColor} fontSize="xs">
              {new Date().toLocaleString()}
            </Text>
          </Skeleton>
        </HStack>
      </VStack>
    </Box>
  );
};

export default TransactionItemSkeleton;
